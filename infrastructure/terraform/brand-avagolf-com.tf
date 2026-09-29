# ------------------------------------------------------------------------------
# brand.avagolf.com
# ------------------------------------------------------------------------------
# Static Astro site: GitHub Actions builds `dist/`, syncs it to S3, and Fastly
# fronts the bucket. The brand pack zip under /files/ is uploaded by the
# AVA-Golf-Brand-Assets repo, not by this site's deploy.
#
# Applied by .github/workflows/terraform.yml when anything here changes on
# main; planned on every pull request that touches it. The Fastly module is
# the one news.avagolf.com and docs.avagolf.com use, so all three subdomains
# get avagolf.com's edge rules from one definition.

locals {
  # redirects.json at the repo root, the same shape as news's and
  # avagolf.com's. This site has none yet; fileexists() keeps it optional.
  redirects_file = "${path.module}/../../redirects.json"

  redirects = fileexists(local.redirects_file) ? {
    for from, entry in jsondecode(file(local.redirects_file)) :
    from => { to = entry.to }
    if startswith(from, "/")
  } : {}
}

module "brand_avagolf_com_storage" {
  source                = "./modules/aws_s3_website"
  bucket_name           = "brand.avagolf.com"
  enable_access_logging = true

  # src/pages/404.astro builds to this key (added in the app PR, #10, which
  # merges first). With index.html here, every dead URL got the homepage
  # under a 404 status, which a crawler reads as a duplicate of it.
  error_document = "404.html"
}

# The service used to be declared inline here. It is the module's now; this
# tells Terraform the existing service moved rather than being replaced.
moved {
  from = fastly_service_vcl.brand_avagolf_com
  to   = module.fastly_brand_avagolf_com.fastly_service_vcl.this
}

module "fastly_brand_avagolf_com" {
  source          = "./modules/fastly_website_service"
  service_name    = "brand.avagolf.com"
  domain_name     = "brand.avagolf.com"
  backend_address = module.brand_avagolf_com_storage.website_endpoint
  redirects       = local.redirects

  # Live on this service (switched on in the Fastly console). Declared so an
  # apply keeps it on.
  image_optimizer = true

  # The deploy uploads without Cache-Control, so the edge sets it. The brand
  # pack keeps the no-cache its own pipeline gives it.
  browser_cache_policy = true
  cache_policy_skip    = "^/files/"
  content_type_fixups  = true

  # Range-capable REST endpoint used only for large /files/*.zip downloads.
  # The website endpoint ignores Range requests, so segmented caching cannot
  # work against it; the REST endpoint honours Range.
  #
  # Addressing: virtual-hosted via the domain-named bucket. The Host header is
  # the bucket name, so S3 resolves the bucket from Host and the path is the
  # object key verbatim. The dotted bucket name would break virtual-hosted TLS,
  # so SNI and cert validation are pinned to the regional endpoint while only
  # the Host header carries the bucket.
  extra_backends = [
    {
      name              = "s3_rest"
      address           = "s3.us-east-2.amazonaws.com"
      port              = 443
      use_ssl           = true
      override_host     = "brand.avagolf.com"
      ssl_cert_hostname = "s3.us-east-2.amazonaws.com"
      ssl_sni_hostname  = "s3.us-east-2.amazonaws.com"
    },
  ]

  # The brand pack (~377 MB) is over Fastly's 20 MB single-object cache limit
  # and 503s without this. Segmented caching splits it into <=20 MB blocks so
  # it stays edge-cached instead of refetching from S3. Priority 10: after the
  # canonical-url snippet (5), before Fastly's return(lookup).
  extra_snippets = [
    {
      name     = "enable-segmented-caching-large-files"
      type     = "recv"
      priority = 10
      content  = "if (req.url.path ~ \"^/files/.*\\.zip$\") { set req.enable_segmented_caching = true; set req.backend = F_s3_rest; }"
    },

    # An agent that asks for Markdown gets the page's Markdown twin, which the
    # build writes next to the HTML (src/integrations/markdownTwins.ts):
    # /voice/ -> /voice.md, / -> /index.md. Browsers never send text/markdown
    # in Accept, so they're unaffected. Runs after the canonical-url snippet
    # (5), so the path is already canonical; only on the first pass, so the
    # fallback's restart below serves the HTML.
    {
      name     = "markdown-negotiation-recv"
      type     = "recv"
      priority = 10
      content  = <<-EOT
        if (req.restarts == 0 && req.http.Accept ~ "(?i)text/markdown" && req.url.path ~ "^/([a-z0-9-]*)/$") {
          set req.http.X-Markdown-Page = req.url;
          set req.url = "/" + if(re.group.1 == "", "index", re.group.1) + ".md" + if(req.url.qs == "", "", "?" + req.url.qs);
        }
      EOT
    },

    # A page with no twin (/tokens/, the 404 page) 404s as .md: restart with
    # the original URL, so the agent gets the HTML page as it would without
    # the header. A twin names its own URL in Content-Location. Every page
    # response carries Vary: Accept, so a cache between us and the client
    # never hands the Markdown to a browser, or the reverse; the edge's own
    # cache is keyed on the rewritten URL and needs no Vary. Only on the node
    # answering the client (visits_this_service == 0), not the shield.
    {
      name     = "markdown-negotiation-deliver"
      type     = "deliver"
      priority = 10
      content  = <<-EOT
        if (fastly.ff.visits_this_service == 0) {
          if (req.http.X-Markdown-Page) {
            if (resp.status == 404) {
              set req.url = req.http.X-Markdown-Page;
              unset req.http.X-Markdown-Page;
              restart;
            }
            set resp.http.Content-Location = req.url.path;
          }
          if (req.http.X-Markdown-Page || req.url.path ~ "/$") {
            set resp.http.Vary = if(resp.http.Vary, resp.http.Vary + ", Accept", "Accept");
          }
        }
      EOT
    },
  ]

  # The *.avagolf.com wildcard in avagolf.com's Terraform covers this host.
  enable_tls = false
}

output "fastly_service_id" {
  value = module.fastly_brand_avagolf_com.service_id
}

output "s3_bucket" {
  value = module.brand_avagolf_com_storage.bucket_name
}

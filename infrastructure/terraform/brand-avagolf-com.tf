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

  # Still index.html: this site has no 404 page yet. Switch to "404.html"
  # once src/pages/404.astro exists, or every dead URL keeps getting the
  # homepage under a 404 status.
  error_document = "index.html"
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

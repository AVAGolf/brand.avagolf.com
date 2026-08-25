# ------------------------------------------------------------------------------
# brand.avagolf.com
# ------------------------------------------------------------------------------
# Static Astro site:
#   GitHub Actions builds `dist/` -> syncs to S3 -> Fastly fronts the bucket.
# DNS lives in the avagolf.com zone (managed in the ava.golf infra repo);
# we only manage the brand subdomain record here.

module "brand_avagolf_com_storage" {
  source                = "./modules/aws_s3_website"
  bucket_name           = "brand.avagolf.com"
  enable_access_logging = true
}

resource "fastly_service_vcl" "brand_avagolf_com" {
  name               = "brand.avagolf.com"
  comment            = "Website Service"
  default_ttl        = 300
  stale_if_error     = true
  stale_if_error_ttl = 300
  activate           = true

  domain {
    name = "brand.avagolf.com"
  }

  backend {
    address       = module.brand_avagolf_com_storage.website_endpoint
    name          = "s3"
    override_host = module.brand_avagolf_com_storage.website_endpoint
    use_ssl       = false
    weight        = 100
    shield        = "iad-va-us"
    port          = 80
  }

  # Range-capable REST endpoint used only for large /files/*.zip downloads.
  # The website endpoint (backend "s3") ignores Range requests, so segmented
  # caching cannot work against it; the REST endpoint honours Range.
  #
  # Addressing: virtual-hosted via the domain-named bucket. The Host header is
  # the bucket name (brand.avagolf.com), so S3 resolves the bucket from Host and
  # the request path is the object key verbatim (no bucket prefix). The dotted
  # bucket name would normally break virtual-hosted TLS, so SNI and cert
  # validation are pinned to the regional endpoint while only the Host header
  # carries the bucket — TLS terminates against s3.us-east-2 with a valid cert.
  backend {
    address           = "s3.us-east-2.amazonaws.com"
    name              = "s3_rest"
    override_host     = "brand.avagolf.com"
    ssl_cert_hostname = "s3.us-east-2.amazonaws.com"
    ssl_sni_hostname  = "s3.us-east-2.amazonaws.com"
    use_ssl           = true
    weight            = 100
    shield            = "iad-va-us"
    port              = 443
  }

  request_setting {
    name      = "force-ssl"
    force_ssl = true
  }

  header {
    action        = "set"
    destination   = "http.Access-Control-Allow-Origin"
    ignore_if_set = false
    name          = "CORS"
    source        = "\"*\""
    type          = "cache"
  }

  header {
    action      = "set"
    destination = "http.Strict-Transport-Security"
    name        = "HSTS"
    source      = "\"max-age=31536000; includeSubDomains\""
    type        = "response"
  }

  product_enablement {
    brotli_compression = true
  }

  # One canonical URL per page: the real path, with its trailing slash.
  #
  # Search Console was filing /typography and /pillars under "Page with
  # redirect" because S3 answered them with a 302 to the slashed form — a
  # temporary redirect, which consolidates no ranking signal into the page it
  # points at. And /index.html returned 200, so the homepage had two addresses
  # that both worked. Both become a single 301 to the one real URL.
  #
  # Priority 5, ahead of the segmented-caching snippet below: a request that is
  # going to be redirected has no backend to choose. Explicit because two recv
  # snippets at the same priority have no visible ordering.
  #
  # Materialized through custom status 750 in vcl_error, the only way to
  # synthesize a response from vcl_recv. The Location is always absolute https,
  # so this agrees with the force_ssl request setting above rather than fighting
  # it: whichever matches first, an http request lands on the same URL.
  snippet {
    name     = "canonical-url-recv"
    type     = "recv"
    priority = 5
    content  = <<-EOT
      declare local var.path STRING;
      declare local var.canonical STRING;
      declare local var.current STRING;

      set var.path = req.url.path;

      set var.path = regsub(var.path, "/index\.html$", "/");

      # Every page builds to a directory, so a bare path gets its slash back.
      # Skipped for anything with a file extension, which is a real file: the
      # /files/*.zip brand packs, /llms.txt, /favicon.svg, /_astro/*.js.
      if (var.path !~ "/$" && var.path !~ "\.[^/]+$") {
        set var.path = var.path + "/";
      }

      set var.canonical = "https://brand.avagolf.com" + var.path;

      if (req.url.qs != "") {
        set var.canonical = var.canonical + "?" + req.url.qs;
      }

      # req.http.Host is absent only on malformed requests; with no host there
      # is no absolute URL to send anyone to, so those fall through to origin.
      set var.current = if(req.http.Fastly-SSL, "https://", "http://") + req.http.Host + req.url;

      if (req.http.Host && var.canonical != var.current) {
        set req.http.X-Canonical-Location = var.canonical;
        error 750 "canonical redirect";
      }
    EOT
  }

  snippet {
    name     = "canonical-url-error"
    type     = "error"
    priority = 10
    content  = <<-EOT
      if (obj.status == 750) {
        set obj.http.Location = req.http.X-Canonical-Location;
        set obj.status = 301;
        set obj.response = "Moved Permanently";
        synthetic "";
        return (deliver);
      }
    EOT
  }

  # Large downloads (e.g. the brand pack zip) exceed Fastly's 20MB single-object
  # cache limit and 503 without this. Segmented caching splits them into <=20MB
  # blocks so they stay edge-cached (cheap egress) instead of refetching origin.
  # Priority 10: must run in vcl_recv before FASTLY's return(lookup).
  snippet {
    name     = "enable-segmented-caching-large-files"
    type     = "recv"
    priority = 10
    content  = "if (req.url.path ~ \"^/files/.*\\.zip$\") { set req.enable_segmented_caching = true; set req.backend = F_s3_rest; }"
  }

  gzip {
    name          = "Generated by terraform"
    extensions    = ["css", "js", "html", "eot", "ico", "otf", "ttf", "json", "svg", "md"]
    content_types = ["text/html", "application/x-javascript", "text/css", "application/javascript", "text/javascript", "application/json", "application/vnd.ms-fontobject", "application/x-font-opentype", "application/x-font-truetype", "application/x-font-ttf", "application/xml", "font/eot", "font/opentype", "font/otf", "image/svg+xml", "image/vnd.microsoft.icon", "text/plain", "text/xml", "binary/octet-stream"]
  }
}

# The avagolf.com TLS subscription in the ava.golf repo already covers
# *.avagolf.com, so no per-subdomain subscription is needed here.

output "fastly_service_id" {
  value = fastly_service_vcl.brand_avagolf_com.id
}

output "s3_bucket" {
  value = module.brand_avagolf_com_storage.bucket_name
}

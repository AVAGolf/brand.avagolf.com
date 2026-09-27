terraform {
  required_providers {
    fastly = {
      source  = "fastly/fastly"
      version = "~> 8.0"
    }
  }
}

# A static site on Fastly in front of an S3 website bucket: the service every
# AVA subdomain site (news, brand, docs) runs, with avagolf.com's edge rules.
# brand.avagolf.com and docs.avagolf.com copy this module unchanged; what
# differs between the sites is passed in (redirects, extra backends and
# snippets, whether the edge sets the browser cache policy).

locals {
  # One VCL line per retired path (redirects.json, the same shape as
  # avagolf.com's), matching the bare and the slashed form. Terraform iterates
  # a map in key order, so the block is byte-stable across applies.
  redirect_vcl = join("", [
    for from, entry in var.redirects :
    format(
      "\nif (var.path == \"%s\" || var.path == \"%s/\") { set var.target = \"%s\"; }",
      trimsuffix(from, "/"),
      trimsuffix(from, "/"),
      startswith(entry.to, "http") ? entry.to : "https://${var.domain_name}${entry.to}"
    )
  ])

  # Whole sections that moved: every path under `from` keeps its remainder
  # under `to` (docs' /launch-monitor/<page>/ -> /sessions/<page>/).
  prefix_redirect_vcl = join("", [
    for from, to in var.prefix_redirects :
    format("\nset var.path = regsub(var.path, \"^%s\", \"%s\");", from, to)
  ])

  cache_policy_skip_vcl = var.cache_policy_skip != "" ? format(" && req.url.path !~ \"%s\"", var.cache_policy_skip) : ""
}

resource "fastly_service_vcl" "this" {
  name               = var.service_name
  comment            = "Website Service"
  default_ttl        = 300
  stale_if_error     = true
  stale_if_error_ttl = 300
  activate           = true
  force_destroy      = var.force_destroy

  domain {
    name = var.domain_name
  }

  backend {
    address       = var.backend_address
    name          = "s3"
    override_host = var.backend_address
    use_ssl       = false
    weight        = 100
    shield        = "iad-va-us"
    port          = 80
  }

  # Site-specific origins, e.g. brand's range-capable S3 REST endpoint for the
  # brand pack zip. A snippet routes to one with `set req.backend = F_<name>;`.
  dynamic "backend" {
    for_each = var.extra_backends
    content {
      address           = backend.value.address
      name              = backend.value.name
      override_host     = backend.value.override_host
      ssl_cert_hostname = backend.value.ssl_cert_hostname
      ssl_sni_hostname  = backend.value.ssl_sni_hostname
      use_ssl           = backend.value.use_ssl
      weight            = 100
      shield            = "iad-va-us"
      port              = backend.value.port
    }
  }

  header {
    action        = "set"
    destination   = "http.Access-Control-Allow-Origin"
    ignore_if_set = false
    name          = "CORS"
    source        = "\"*\""
    type          = "cache"
  }

  # Browsers go straight to https for a year, on this host and every
  # subdomain of it. The canonical-url snippet below already 301s http to
  # https; this stops the browser trying http at all.
  header {
    action      = "set"
    destination = "http.Strict-Transport-Security"
    name        = "HSTS"
    source      = "\"max-age=31536000; includeSubDomains\""
    type        = "response"
  }

  # The response headers Lighthouse's Best Practices audit checks for. No
  # Content-Security-Policy: the GTM container loads scripts from origins it
  # decides at runtime, so a CSP strict enough to mean anything would break
  # the tags.
  header {
    action      = "set"
    destination = "http.X-Content-Type-Options"
    name        = "X-Content-Type-Options"
    source      = "\"nosniff\""
    type        = "response"
  }
  header {
    action      = "set"
    destination = "http.Referrer-Policy"
    name        = "Referrer-Policy"
    source      = "\"strict-origin-when-cross-origin\""
    type        = "response"
  }
  header {
    action      = "set"
    destination = "http.Permissions-Policy"
    name        = "Permissions-Policy"
    source      = "\"camera=(), microphone=(), geolocation=(), payment=()\""
    type        = "response"
  }
  header {
    action      = "set"
    destination = "http.Cross-Origin-Opener-Policy"
    name        = "Cross-Origin-Opener-Policy"
    source      = "\"same-origin\""
    type        = "response"
  }

  # Image Optimizer is live on every AVA service (switched on in the Fastly
  # console; `fastly-io-info` shows on any image with ?width=). An apply
  # converges this block to exactly what it lists, so leaving it out would
  # switch IO off. Its default settings stay console-managed while no
  # image_optimizer_default_settings block exists.
  product_enablement {
    brotli_compression = true
    image_optimizer    = var.image_optimizer
  }

  # No "binary/octet-stream": that was the type the old uploader stored for
  # .webp and .woff2, both already compressed, so matching it only ran them
  # through Brotli twice. "md" in extensions covers the Markdown copies.
  gzip {
    name          = "Generated by terraform"
    extensions    = ["css", "js", "html", "eot", "ico", "otf", "ttf", "json", "svg", "md", "txt", "xml"]
    content_types = ["text/html", "application/x-javascript", "text/css", "application/javascript", "text/javascript", "application/json", "application/vnd.ms-fontobject", "application/x-font-opentype", "application/x-font-truetype", "application/x-font-ttf", "application/xml", "application/rss+xml", "font/eot", "font/opentype", "font/otf", "image/svg+xml", "image/vnd.microsoft.icon", "text/markdown", "text/plain", "text/xml"]
  }

  # One canonical URL per page, in one hop, before the request reaches S3.
  # avagolf.com's rule (infrastructure/terraform/ava-golf.tf there):
  #
  #   - no TLS                -> https://<host><path>
  #   - /path/index.html      -> /path/   (S3 answers to the built file too)
  #   - /path                 -> /path/   (S3 did this itself, but as a 302,
  #                                        which consolidates nothing)
  #   - a redirects.json path -> its new home
  #
  # All decided against one normalized URL, so a request wrong in several ways
  # still costs one hop. Materialized through custom status 750 in vcl_error,
  # the only way to synthesize a response from recv. The query string is
  # carried through so campaign attribution survives.
  # Priority 5, ahead of any site snippet at the default 10, so a request that
  # is about to be redirected never reaches one.
  snippet {
    name     = "canonical-url-recv"
    type     = "recv"
    priority = 5
    content  = <<-EOT
      declare local var.host STRING;
      declare local var.path STRING;
      declare local var.target STRING;
      declare local var.canonical STRING;
      declare local var.current STRING;

      set var.host = regsub(req.http.Host, ":[0-9]+$", "");
      set var.path = req.url.path;

      set var.path = regsub(var.path, "/index\.html$", "/");${local.prefix_redirect_vcl}

      # Every page builds to a directory, so a bare path gets its slash back.
      # Skipped for anything with a file extension (/llms.txt, /rss.xml,
      # /news/<slug>.md, /_astro/*.js).
      if (var.path !~ "/$" && var.path !~ "\.[^/]+$") {
        set var.path = var.path + "/";
      }

      set var.target = "";${local.redirect_vcl}

      if (var.target != "") {
        set var.canonical = var.target;
      } else {
        set var.canonical = "https://" + var.host + var.path;
      }

      if (req.url.qs != "") {
        set var.canonical = var.canonical + if(var.canonical ~ "\?", "&", "?") + req.url.qs;
      }

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

  # Content-Type for the types an old uploader stored as binary/octet-stream
  # (.webp, .woff2, .md), set on the way into the cache whatever S3 holds.
  # Only 200s: a missing file is the error document, which is HTML.
  dynamic "snippet" {
    for_each = var.content_type_fixups ? [1] : []
    content {
      name    = "content-type-fixups"
      type    = "fetch"
      content = <<-EOT
        if (beresp.status == 200) {
          if (req.url.path ~ "(?i)\.woff2$") {
            set beresp.http.Content-Type = "font/woff2";
          } else if (req.url.path ~ "(?i)\.webp$") {
            set beresp.http.Content-Type = "image/webp";
          } else if (req.url.path ~ "(?i)\.md$") {
            set beresp.http.Content-Type = "text/markdown; charset=utf-8";
          }
        }
      EOT
    }
  }

  # How long a browser may keep what it's sent, for sites whose deploy uploads
  # without a Cache-Control (news sets its tiers at upload instead). avagolf.com's
  # tiers:
  #   /_astro/*      content-hashed names: a year, never revalidate
  #   public/ media  stable URLs replaced in place: a week
  #   everything else (HTML, feeds, llms.txt): revalidate every time; S3's ETag
  #                  makes that a 304 when nothing changed
  # Only on the node answering the browser (visits_this_service == 0), so the
  # shield never hands these to the edge as its TTL. Paths matching
  # `cache_policy_skip` keep whatever S3 sends (brand's /files/ zip).
  dynamic "snippet" {
    for_each = var.browser_cache_policy ? [1] : []
    content {
      name    = "browser-cache-policy"
      type    = "deliver"
      content = <<-EOT
        if (fastly.ff.visits_this_service == 0${local.cache_policy_skip_vcl}) {
          if (resp.status == 200 || resp.status == 206 || resp.status == 304) {
            if (req.url.path ~ "^/_astro/") {
              set resp.http.Cache-Control = "public, max-age=31536000, immutable";
            } else if (req.url.path ~ "(?i)\.(avif|gif|ico|jpe?g|mov|mp4|png|svg|webm|webp|woff2?)$") {
              set resp.http.Cache-Control = "public, max-age=604800, stale-while-revalidate=86400";
            } else {
              set resp.http.Cache-Control = "no-cache";
            }
          } else if (resp.status >= 400) {
            set resp.http.Cache-Control = "no-cache";
          }
        }
      EOT
    }
  }

  # Site-specific VCL, e.g. brand's segmented caching for the brand pack.
  dynamic "snippet" {
    for_each = var.extra_snippets
    content {
      name     = snippet.value.name
      type     = snippet.value.type
      priority = snippet.value.priority
      content  = snippet.value.content
    }
  }
}

resource "fastly_tls_subscription" "this" {
  count                 = var.enable_tls ? 1 : 0
  domains               = [var.domain_name]
  certificate_authority = "lets-encrypt"
}

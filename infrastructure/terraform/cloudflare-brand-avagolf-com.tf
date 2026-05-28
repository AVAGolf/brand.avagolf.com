# DNS record for brand.avagolf.com -> Fastly.
# Target matches news.avagolf.com (same *.avagolf.com TLS subscription).
resource "cloudflare_dns_record" "brand_avagolf_com" {
  zone_id = var.cloudflare_avagolf_com_zone_id
  name    = "brand"
  type    = "CNAME"
  content = "n.sni.global.fastly.net"
  ttl     = 1 # 1 = "Automatic"
  proxied = false
  comment = "brand.avagolf.com -> Fastly (managed in brand.avagolf.com repo)"
}

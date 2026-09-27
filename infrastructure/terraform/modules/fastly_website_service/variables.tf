variable "service_name" {
  description = "Name of the Fastly service"
  type        = string
}

variable "domain_name" {
  description = "The site's hostname, e.g. news.avagolf.com"
  type        = string
}

variable "backend_address" {
  description = "The origin, the S3 website endpoint"
  type        = string
}

variable "redirects" {
  description = "Retired paths and where they live now: redirects.json with the \"_comment\" key removed. `to` is a path on this host or an absolute URL."
  type        = map(object({ to = string }))
  default     = {}
}

variable "prefix_redirects" {
  description = "Sections that moved: path prefix -> new prefix, e.g. { \"/launch-monitor/\" = \"/sessions/\" }. Regex-safe prefixes only."
  type        = map(string)
  default     = {}
}

variable "extra_backends" {
  description = "Origins besides the S3 website bucket. Route to one from a snippet with `set req.backend = F_<name>;`."
  type = list(object({
    name              = string
    address           = string
    port              = number
    use_ssl           = bool
    override_host     = optional(string)
    ssl_cert_hostname = optional(string)
    ssl_sni_hostname  = optional(string)
  }))
  default = []
}

variable "extra_snippets" {
  description = "Site-specific VCL snippets. The canonical-url snippet runs at priority 5, so give these 10 or more."
  type = list(object({
    name     = string
    type     = string
    priority = optional(number, 10)
    content  = string
  }))
  default = []
}

variable "browser_cache_policy" {
  description = "Set browser Cache-Control at the edge (avagolf.com's tiers). For sites whose deploy uploads without one; news sets its own at upload."
  type        = bool
  default     = false
}

variable "cache_policy_skip" {
  description = "A VCL regex of paths the browser cache policy leaves alone, e.g. \"^/files/\"."
  type        = string
  default     = ""
}

variable "content_type_fixups" {
  description = "Correct the Content-Type of .webp, .woff2 and .md responses at the edge."
  type        = bool
  default     = false
}

variable "image_optimizer" {
  description = "Fastly Image Optimizer. On for every AVA service; see the note in main.tf before turning it off."
  type        = bool
  default     = true
}

variable "enable_tls" {
  description = "Create a TLS subscription for this domain. False for AVA subdomains: the *.avagolf.com wildcard in avagolf.com's Terraform covers them."
  type        = bool
  default     = false
}

variable "force_destroy" {
  description = "When true, the service can be destroyed even when an active version exists."
  type        = bool
  default     = false
}

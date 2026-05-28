variable "region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-2"
}

variable "aws_profile" {
  description = "AWS Profile"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
  default     = "brand.avagolf.com"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_email" {
  description = "Cloudflare email"
  type        = string
  sensitive   = true
}

variable "fastly_api_token" {
  type      = string
  sensitive = true
}

# Zone is managed in the ava.golf infra repo. We reference it by ID here.
variable "cloudflare_avagolf_com_zone_id" {
  description = "Cloudflare zone ID for avagolf.com"
  type        = string
  default     = "e690f4cbe14dc74233ccb7b3a76749cc"
}

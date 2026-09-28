variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the bucket"
  type        = map(string)
  default     = {}
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "enable_access_logging" {
  description = "Create a separate S3 bucket for access logs (named {bucket_name}-access-logs)"
  type        = bool
  default     = true
}

variable "error_document" {
  description = "S3 website error document. The default serves the site root for any missing key, which is the SPA fallback; a static multi-page site should name its own 404 page instead."
  type        = string
  default     = "index.html"
}

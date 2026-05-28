variable "service_name" {
  description = "Name of the Fastly Service"
  type        = string
}

variable "domain_name" {
  description = "The DNS domain name for the service"
  type        = string
}

variable "backend_address" {
  description = "The backend origin address (e.g. S3 website endpoint)"
  type        = string
}

variable "logging_bucket_name" {
  description = "The S3 bucket for Fastly logs"
  type        = string
  default     = ""
}

variable "logging_path" {
  description = "The path prefix for Fastly logs"
  type        = string
  default     = ""
}

variable "logging_s3_iam_role_arn" {
  description = "The IAM role ARN for Fastly to write logs to S3"
  type        = string
  default     = "arn:aws:iam::235756540877:role/Fastly_Logging"
}


variable "enable_tls" {
  description = "Create your own TLS subscription)"
  type        = bool
  default     = true
}

variable "force_destroy" {
  description = "When true, the service can be destroyed even when an active version exists."
  type        = bool
  default     = false
}

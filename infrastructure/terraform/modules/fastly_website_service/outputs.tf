output "service_id" {
  description = "The ID of the Fastly service"
  value       = fastly_service_vcl.this.id
}

output "service_url" {
  description = "The URL of the Fastly service"
  value       = "https://${var.domain_name}"
}

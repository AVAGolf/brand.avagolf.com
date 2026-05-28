output "bucket_name" {
  description = "The name of the created S3 bucket"
  value       = aws_s3_bucket.this.bucket
}

output "bucket_id" {
  description = "The ID of the created S3 bucket"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "The ARN of the created S3 bucket"
  value       = aws_s3_bucket.this.arn
}

output "website_endpoint" {
  description = "The S3 website endpoint"
  value       = "${aws_s3_bucket.this.bucket}.s3-website.${data.aws_region.current.name}.amazonaws.com"
}

output "website_endpoint_url" {
  description = "The full S3 website URL"
  value       = "http://${aws_s3_bucket.this.bucket}.s3-website.${data.aws_region.current.name}.amazonaws.com"
}

output "access_logs_bucket_name" {
  description = "The name of the access logs bucket (if created)"
  value       = try(aws_s3_bucket.access_logs[0].bucket, null)
}

output "access_logs_bucket_id" {
  description = "The ID of the access logs bucket (if created)"
  value       = try(aws_s3_bucket.access_logs[0].id, null)
}


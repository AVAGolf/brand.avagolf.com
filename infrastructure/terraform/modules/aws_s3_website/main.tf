terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}

data "aws_region" "current" {}
data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  tags   = var.tags
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document {
    suffix = "index.html"
  }
  error_document { key = "index.html" }
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = var.cors_allowed_origins
    allowed_headers = ["*"]
  }
}

resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.this.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "this" {
  depends_on = [
    aws_s3_bucket_ownership_controls.this,
    aws_s3_bucket_public_access_block.this,
  ]

  bucket = aws_s3_bucket.this.id
  access_control_policy {
    owner {
      id = data.aws_canonical_user_id.current.id
    }
    grant {
      permission = "FULL_CONTROL"
      grantee {
        type = "CanonicalUser"
        id   = data.aws_canonical_user_id.current.id
      }
    }
  }
}

#
# Bucket Policy
#
resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = jsonencode({
  "Version": "2008-10-17",
  "Id": "publicAccess",
  "Statement": [
    {
      "Sid": "Prevent bucket delete",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:DeleteBucket",
      "Resource":  "${aws_s3_bucket.this.arn}"
    },
    {
      "Sid": "allow public",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource":  "${aws_s3_bucket.this.arn}/*"
    }
  ]
  })
}

# ------------------------------------------------------------------------------
# Access Logs Bucket (Optional)
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "access_logs" {
  count  = var.enable_access_logging ? 1 : 0
  bucket = "${var.bucket_name}-access-logs"
  tags   = var.tags
}

resource "aws_s3_bucket_logging" "this" {
  count         = var.enable_access_logging ? 1 : 0
  bucket        = aws_s3_bucket.this.id
  target_bucket = aws_s3_bucket.access_logs[0].id
  target_prefix = ""
}

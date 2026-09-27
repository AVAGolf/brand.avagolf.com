terraform {
  # 1.10 for S3-native state locking (`use_lockfile` below).
  required_version = ">= 1.10.0"

  # Ranges; the versions CI installs are the ones recorded in
  # .terraform.lock.hcl (committed). The same pins and lock entries as
  # avagolf.com's infrastructure/terraform, so every AVA site runs the same
  # providers. Upgrade on purpose: `terraform init -upgrade`, read the plan,
  # commit the rewritten lock file.
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      # 5.26.0 plans `include_shadow_metadata = false` onto every existing
      # cloudflare_dns_record and then fails the apply
      # (cloudflare/terraform-provider-cloudflare#7387). avagolf.com holds
      # below it for the same reason.
      version = "~> 5.0, < 5.26.0"
    }
    fastly = {
      source  = "fastly/fastly"
      version = "~> 8.0"
    }
  }

  # No hardcoded `profile`, so the same backend works in CI (credentials in
  # the environment) and locally (export AWS_PROFILE=ava-prod). `use_lockfile`
  # takes a lock object in the bucket for the length of a plan or apply, so a
  # CI apply and a local one can't write state at the same time.
  backend "s3" {
    bucket       = "ava-golf-prod-tf-state-bucket"
    key          = "brand-avagolf-com/terraform.tfstate"
    region       = "us-east-2"
    use_lockfile = true
  }
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile != "" ? var.aws_profile : null
}

provider "cloudflare" {
  api_key = var.cloudflare_api_token
  email   = var.cloudflare_email
}

provider "fastly" {
  api_key = var.fastly_api_token
}

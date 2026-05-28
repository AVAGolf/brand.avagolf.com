terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
    fastly = {
      source  = "fastly/fastly"
      version = "~> 8.0"
    }
  }

  backend "s3" {
    bucket  = "ava-golf-prod-tf-state-bucket"
    key     = "brand-avagolf-com/terraform.tfstate"
    region  = "us-east-2"
    profile = "ava-prod"
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

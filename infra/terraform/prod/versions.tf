terraform {
  required_version = "~> 1.14.0"

  backend "gcs" {
    bucket = "critical-history-tfstate-422714632513"
    prefix = "critical-history/prod"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.35.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google" {
  alias                           = "no_attribution"
  project                         = var.project_id
  region                          = var.region
  add_terraform_attribution_label = false
}

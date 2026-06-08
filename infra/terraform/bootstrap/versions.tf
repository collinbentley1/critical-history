terraform {
  required_version = "~> 1.14.0"

  backend "gcs" {
    bucket = "critical-history-tfstate-422714632513"
    prefix = "critical-history/bootstrap"
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

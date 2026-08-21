variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
  default     = "critical-history-16823277"
}

variable "region" {
  description = "Primary Google Cloud region."
  type        = string
  default     = "us-east4"
}

variable "state_bucket_name" {
  description = "Globally unique Cloud Storage bucket for routine production Terraform state."
  type        = string
  default     = "critical-history-tfstate-422714632513"
}

variable "bootstrap_state_bucket_name" {
  description = "Globally unique, separately protected bucket for privileged bootstrap Terraform state."
  type        = string
  default     = "critical-history-tfstate-422714632513-bootstrap"

  validation {
    condition     = var.bootstrap_state_bucket_name != var.state_bucket_name
    error_message = "bootstrap_state_bucket_name must be distinct from the routine production state bucket."
  }
}

variable "state_bucket_location" {
  description = "Cloud Storage location for Terraform state."
  type        = string
  default     = "US-EAST4"
}

variable "github_owner" {
  description = "GitHub repository owner."
  type        = string
  default     = "collinbentley1"
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
  default     = "critical-history"
}

variable "github_owner_id" {
  description = "Immutable numeric GitHub owner ID."
  type        = string
  default     = "16823277"

  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.github_owner_id))
    error_message = "github_owner_id must be a positive decimal ID."
  }
}

variable "github_repository_id" {
  description = "Immutable numeric GitHub repository ID."
  type        = string
  default     = "280932482"

  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.github_repository_id))
    error_message = "github_repository_id must be a positive decimal ID."
  }
}

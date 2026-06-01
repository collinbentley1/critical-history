# Critical History Map

Critical History Map is a Yale and New Haven history map adapted from an in-person tour developed by Esul Burton and Janis Jin.

The project is now a pure Bun application deployed to Google Cloud Run through GitOps workflows.

## What is here

- A framework-free Bun frontend and Bun HTTP server.
- Location content in `src/locations/*.json` and static media in `public/images`.
- Runtime Mapbox configuration served from `/api/config`.
- Terraform bootstrap for Google Cloud APIs, Terraform state, Workload Identity Federation, and CI service accounts.
- Terraform production infrastructure for Artifact Registry and Cloud Run.
- GitHub Actions for Bun verification, Socket Firewall install checks, Checkov/Terraform validation, PR previews, preview cleanup, and production deploys.
- SHA-pinned GitHub Actions.

## Local Development

Use Bun canary, matching CI and the production Docker build:

```sh
bun upgrade --canary
bun install
cp .env.example .env.local
bun run dev
```

Set `MAPBOX_ACCESS_TOKEN` in your shell or `.env.local` if you want the map to load locally.

Run the full local check:

```sh
bun run verify
```

## Deployment Model

- Pull requests deploy Cloud Run preview services named `critical-history-pr-<number>`.
- Closing a pull request deletes its preview Cloud Run service.
- Pushes to `main` deploy the production Cloud Run service named `critical-history`.
- Terraform manages only long-lived shared infrastructure. It does not manage preview environments.

The Google Cloud project display name is `critical-history`. The exact project ID `critical-history` was already reserved globally, so this deployment uses `critical-history-16823277`.

## Bootstrap

The bootstrap root is applied manually because it creates the GitHub Actions identities that later run production Terraform.

```sh
gcloud services enable \
  serviceusage.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  storage.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --project=critical-history-16823277

export GOOGLE_OAUTH_ACCESS_TOKEN="$(gcloud auth print-access-token)"
terraform -chdir=infra/terraform/bootstrap init
terraform -chdir=infra/terraform/bootstrap apply
terraform -chdir=infra/terraform/prod init
terraform -chdir=infra/terraform/prod apply
```

Both Terraform roots use a GCS backend:

```text
bucket: critical-history-tfstate-422714632513
prefix: critical-history/bootstrap
prefix: critical-history/prod
```

After bootstrap, set these repository variables from Terraform output:

```sh
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo collinbentley1/critical-history --body "$(terraform -chdir=infra/terraform/bootstrap output -raw workload_identity_provider)"
gh variable set GCP_TERRAFORM_SERVICE_ACCOUNT --repo collinbentley1/critical-history --body "$(terraform -chdir=infra/terraform/bootstrap output -raw terraform_service_account_email)"
gh variable set GCP_PROD_DEPLOY_SERVICE_ACCOUNT --repo collinbentley1/critical-history --body "$(terraform -chdir=infra/terraform/bootstrap output -raw prod_deploy_service_account_email)"
gh variable set GCP_PREVIEW_DEPLOY_SERVICE_ACCOUNT --repo collinbentley1/critical-history --body "$(terraform -chdir=infra/terraform/bootstrap output -raw preview_deploy_service_account_email)"
gh variable set GCP_RUNTIME_SERVICE_ACCOUNT --repo collinbentley1/critical-history --body "$(terraform -chdir=infra/terraform/bootstrap output -raw runtime_service_account_email)"
gh secret set MAPBOX_ACCESS_TOKEN --repo collinbentley1/critical-history --body "$MAPBOX_ACCESS_TOKEN"
```

The Dockerfile uses Docker Hardened Images. Add `DHI_USERNAME` and `DHI_ACCESS_TOKEN` as GitHub Actions secrets before enabling deploy workflows.

## Domain

Custom domain mappings are intentionally empty in Terraform for now. Add the production domain mappings after the Cloud Run service is live and the domain decision is final.

## License

Distributed under the MIT License. See `LICENSE` for details.

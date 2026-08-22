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

Use Bun `1.4.0` at the exact reviewed revision
`34cbb9a40b4bd1bd767d134a7065e66c2432a676`, matching CI and the production
container. Before installing dependencies or running a repository script, fail
closed on the full embedded revision:

```sh
bun -e 'if (Bun.version !== "1.4.0" || Bun.revision !== "34cbb9a40b4bd1bd767d134a7065e66c2432a676") throw new Error("Bun must be 1.4.0+34cbb9a40")'
bun install
cp .env.example .env.local
bun run dev
```

Never install or upgrade Bun from a moving `stable`, `latest`, or `canary`
channel for this repository. `bun --revision` is a convenient display check,
but it abbreviates the commit; the assertion above is the canonical local
check. The Docker image pins `bun-v1.4.0` exactly.

Set a URL-restricted, read-only Mapbox `pk.*` token as `MAPBOX_PUBLIC_TOKEN`
in your shell or `.env.local` if you want the map to load locally. The server
rejects secret `sk.*` tokens rather than exposing them through `/api/config`.

Run the full local check:

```sh
bun run verify
```

## Deployment Model

- Same-repository, non-draft pull requests publish a scanned image and attach an
  exact-head `pr-<number>` tag to the shared no-data preview service. A new head,
  draft conversion, or close invalidates that tag; hourly reconciliation removes
  orphaned tags.
- External-fork and Dependabot pull requests run secretless application checks
  but never receive build, cloud, or preview credentials.
- A push to `main` runs metadata-only infrastructure convergence first, then
  publishes and deploys the exact scanned production digest.
- Consumer Terraform roots are reviewed validation mirrors. They are never
  executed with Google credentials. Only the owner-controlled protected
  bootstrap pipeline may run the immutable deployment roots in the exact
  platform commit.

The Google Cloud project ID is `critical-history-16823277`.

## Protected configuration and rollout

Do not add repository-scoped Actions secrets or GCP routing variables. The sole
credential-bearing build environment is
`dhi-base-prefetch-20260822-098dca9280b3`, shared by preview and production.
It contains exactly the public-read-only
`DHI_PUBLIC_READ_TOKEN_20260822_098DCA9280B3` secret and the non-confidential
`DHI_USERNAME` variable. No Socket token or mutable Grype database manifest is
stored in GitHub; Socket uses public policy and Grype data is byte-pinned in the
reviewed platform commit. After inventory proof and old provider-token
revocation, the retired `preview-build`, `production-build`, and
`dependency-scan` environments must be empty and deleted.

`preview-cloud` and `production` expose only their URL-restricted public
Mapbox `pk.*` value as the non-confidential `MAPBOX_PUBLIC_TOKEN` variable.
Cloud publish, deploy, and operator environments otherwise carry exact-SHA WIF
only: no static GCP credential and no caller-selected routing value.

The runtime accepts only `MAPBOX_PUBLIC_TOKEN`; the retired
`MAPBOX_ACCESS_TOKEN` name is rejected and cleared during deployment. Public
Mapbox tokens must be restricted to the intended preview or production origins.

Bootstrap, WIF/IAM cutover, state migration, and rollback follow the exact
platform commit's `docs/security-rollout.md`. Routine convergence has read-only,
lock-free access to production metadata. Privileged bootstrap state lives in a
separate protected bucket; no manual `terraform apply`, local-backend bootstrap,
or consumer-workflow apply is supported.

Before enabling Actions, verify the exact epoch DHI environment inventory,
populate only its one secret and one variable, configure the protected public
Mapbox variables, and delete legacy repository secrets. Require full-SHA Actions
and verify the protected bootstrap plan and state lineage. Keep Actions disabled
until the exact WIF canaries, no-data preview identity, and final consumer SHA
are proven.

## Domain

Production custom domain mappings are `ycriticalhistory.org` and
`www.ycriticalhistory.org`. Their protected exposure state is managed separately
from routine production convergence; DNS changes require an owner-reviewed
exposure plan.

## License

Distributed under the MIT License. See `LICENSE` for details.

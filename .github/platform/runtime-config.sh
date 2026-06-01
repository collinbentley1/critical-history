#!/usr/bin/env bash
set -euo pipefail

if [ -n "${MAPBOX_ACCESS_TOKEN:-}" ]; then
  echo "flags=--set-env-vars=MAPBOX_ACCESS_TOKEN=${MAPBOX_ACCESS_TOKEN}" >> "$GITHUB_OUTPUT"
else
  echo "flags=" >> "$GITHUB_OUTPUT"
fi

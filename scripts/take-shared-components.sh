#!/usr/bin/env bash
# Put avagolf.com's shared-components/ and scripts/ci/ into this repo, taken
# straight from avagolf.com's main (or the ref given). Copied from avagolf.com's
# scripts/ci/take-shared-components.sh, with the sparse set widened to include
# scripts/ci/ (the Lighthouse runner, dist diff and sticky-comment tools this
# repo's workflows call).
#
#   scripts/take-shared-components.sh [ref]
#   scripts/take-shared-components.sh --if-missing   # skip when both are present
#
# avagolf.com is private. In CI, AVAGOLF_READ_TOKEN is a token that can read
# AVAGolf/avagolf.com; locally, your own git credentials are used. Both folders
# are in .gitignore: they are copies, refreshed on every build.
#
# The commit taken is written to shared-components/SOURCE, which the build
# publishes at /build.json so every deploy says what it was built from.
set -euo pipefail

if [ "${1:-}" = "--if-missing" ]; then
  if [ -d shared-components ] && [ -d scripts/ci ]; then exit 0; fi
  shift
fi

ref="${1:-main}"
repo="github.com/AVAGolf/avagolf.com.git"
url="https://${repo}"
if [ -n "${AVAGOLF_READ_TOKEN:-}" ]; then
  url="https://x-access-token:${AVAGOLF_READ_TOKEN}@${repo}"
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git clone --quiet --depth 1 --branch "$ref" --filter=blob:none --sparse "$url" "$tmp"
git -C "$tmp" sparse-checkout set shared-components scripts/ci
for dir in shared-components scripts/ci; do
  if [ ! -d "$tmp/$dir" ]; then
    echo "avagolf.com@$ref has no $dir/ folder." >&2
    exit 1
  fi
done

sha="$(git -C "$tmp" rev-parse HEAD)"
rm -rf shared-components scripts/ci
cp -R "$tmp/shared-components" shared-components
mkdir -p scripts
cp -R "$tmp/scripts/ci" scripts/ci
printf '%s\n' "$sha" > shared-components/SOURCE
echo "shared-components and scripts/ci from avagolf.com@${sha:0:7} ($ref)"

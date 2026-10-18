# zotero-random-read tasks. Run `just` to list them.

default:
    @just --list

# Package src/ as dist/random-read.xpi and write dist/update.json.
build:
    rm -rf dist && mkdir -p dist
    cd src && zip -r -X ../dist/random-read.xpi . -x '.*'
    node scripts/update-json.mjs

# Syntax-check the JS and validate the manifest.
check:
    node --check src/bootstrap.js
    node --check src/content/random-read.js
    node --check scripts/update-json.mjs
    node -e 'JSON.parse(require("fs").readFileSync("src/manifest.json"))'

# Serve the GitHub Pages site on http://localhost:8000.
site:
    cd docs && python3 -m http.server 8000

# Tag main as v<version> (from src/manifest.json) and push the tag.
# CI then builds the .xpi and publishes the GitHub release.
release: check
    #!/usr/bin/env bash
    set -euo pipefail
    v=$(node -p 'require("./src/manifest.json").version')
    jj tag set "v$v" -r main
    jj git push --remote origin --tag "v$v"
    jj git push --remote github --tag "v$v"

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

# Tag v<version> from src/manifest.json and publish a GitHub release.
release: check build
    #!/usr/bin/env bash
    set -euo pipefail
    v=$(node -p 'require("./src/manifest.json").version')
    gh release create "v$v" dist/random-read.xpi dist/update.json \
        --repo zpeters/zotero-random-read --title "v$v" --generate-notes

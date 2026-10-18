# zotero-random-read tasks. Run `just` to list them.

default:
    @just --list

# Package src/ as dist/random-read.xpi.
build:
    rm -rf dist && mkdir -p dist
    cd src && zip -r -X ../dist/random-read.xpi . -x '.*'

# Syntax-check the JS and validate the manifest.
check:
    node --check src/bootstrap.js
    node --check src/content/random-read.js
    node -e 'JSON.parse(require("fs").readFileSync("src/manifest.json"))'

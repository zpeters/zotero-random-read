# AGENTS.md

Zotero 7+ bootstrapped plugin. No build step beyond zipping `src/`.

- `src/bootstrap.js`: lifecycle hooks only. All logic lives in `src/content/random-read.js`.
- Read status uses the Zotero Reading List plugin's Extra-field lines
  (`Read_Status: …`, `Read_Status_Date: <ISO>`). Keep that format compatible.
- `docs/` is the GitHub Pages site (static HTML, no framework).
- Version lives in `src/manifest.json`; `just release` tags and publishes from it.
- VCS is jj. Remotes: `origin` (git server) and `github`. Push `main` to both.

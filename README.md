<p align="center">
  <img src=".github/dice.svg" width="72" height="72" alt="">
</p>

<h1 align="center">Random Read</h1>

<p align="center">
  A Zotero plugin that picks your next paper for you.<br>
  <a href="https://zpeters.github.io/zotero-random-read/">Website</a> ·
  <a href="https://github.com/zpeters/zotero-random-read/releases/latest">Download</a>
</p>

<p align="center">
  <a href="https://github.com/zpeters/zotero-random-read/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/zpeters/zotero-random-read?color=be2a4a"></a>
  <img alt="Zotero 7+" src="https://img.shields.io/badge/Zotero-7%2B-be2a4a">
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/zpeters/zotero-random-read?color=555"></a>
</p>

---

Your library grows faster than you read it. Random Read removes the choice.
Click the dice and it:

1. **Picks** one random item from My Library that you have not started.
2. **Files** it in your `~In Progress~` collection.
3. **Marks** it *To Read*, then selects it so you can open it.

## Install

1. Download `random-read.xpi` from the [latest release](https://github.com/zpeters/zotero-random-read/releases/latest).
2. In Zotero, open **Tools → Plugins**.
3. Click the gear icon, choose **Install Plugin From File…**, and select the file.

Zotero checks for updates of the plugin automatically.

## Use

- Click the **dice** button in the items toolbar, or
- choose **Tools → Pick a Random Item to Read**.

A pop-up shows the title of the item and the size of the pool it came from.

## What it picks from

All regular items in My Library (not notes, attachments or items in the trash)
that:

- are not already in `~In Progress~`, and
- have no read status, or the status *New*.

Items marked *To Read*, *In Progress*, *Read* or *Not Reading* are skipped.

## Requirements

- Zotero 7 or later.
- A collection named exactly `~In Progress~` in My Library.
- [Zotero Reading List](https://github.com/Dominic-DallOsto/zotero-reading-list)
  is optional. Random Read writes the status in the same Extra-field format
  (`Read_Status: To Read`), so the Read Status column shows it. Without that
  plugin, the status is still saved in the Extra field.

## Develop

The dev shell comes from a Nix flake through direnv.

```sh
direnv allow
just check     # syntax-check the JS, validate the manifest
just build     # dist/random-read.xpi and dist/update.json
just site      # preview the website at http://localhost:8000
just release   # tag v<version> and publish a GitHub release
```

## License

[MIT](LICENSE). Not affiliated with Zotero or the Corporation for Digital Scholarship.

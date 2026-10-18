# Random Read

A Zotero 7+ plugin. Click the dice button in the items toolbar (or
**Tools → Pick a Random Item to Read**) to:

1. Pick one random regular item from My Library that has no read status
   (or is "New") and is not already in `~In Progress~`.
2. Add it to the `~In Progress~` collection.
3. Set its read status to "To Read" in the Extra field, in the format of the
   Zotero Reading List plugin.
4. Select it in the item list.

## Build and install

    direnv allow
    just check build

Then in Zotero: **Tools → Plugins → gear → Install Plugin From File…** and
choose `dist/random-read.xpi`.

/* Pick one random unread item, file it in ~In Progress~ and mark it "To Read".
 *
 * The read status uses the same Extra-field lines as the Zotero Reading List
 * plugin (reading-list@hotmail.com), so its "Read Status" column shows it. */

Zotero.RandomRead = {
	COLLECTION_NAME: "~In Progress~",
	NEW_STATUS: "To Read",
	// Items with one of these statuses are already handled, so never pick them.
	SKIP_STATUSES: ["To Read", "In Progress", "Read", "Not Reading"],
	STATUS_FIELD: "Read_Status",
	DATE_FIELD: "Read_Status_Date",
	ICON: "chrome://random-read/content/icons/dice.svg",
	BUTTON_ID: "random-read-toolbar-button",
	MENU_ID: "random-read-tools-menuitem",

	init() {},

	addToWindow(win) {
		const doc = win.document;
		if (doc.getElementById(this.BUTTON_ID)) {
			return;
		}

		const toolbar = doc.getElementById("zotero-items-toolbar");
		if (toolbar) {
			const button = doc.createXULElement("toolbarbutton");
			button.id = this.BUTTON_ID;
			button.className = "zotero-tb-button";
			button.setAttribute("tooltiptext", "Pick a random item to read");
			button.style.listStyleImage = `url("${this.ICON}")`;
			button.addEventListener("command", () => this.pick(win));
			// Put the dice before the spacer that pushes the search box right.
			const spacer = toolbar.querySelector("spacer");
			toolbar.insertBefore(button, spacer);
		}

		const toolsPopup = doc.getElementById("menu_ToolsPopup");
		if (toolsPopup) {
			const item = doc.createXULElement("menuitem");
			item.id = this.MENU_ID;
			item.setAttribute("label", "Pick a Random Item to Read");
			item.addEventListener("command", () => this.pick(win));
			toolsPopup.appendChild(item);
		}
	},

	removeFromWindow(win) {
		for (const id of [this.BUTTON_ID, this.MENU_ID]) {
			win.document.getElementById(id)?.remove();
		}
	},

	removeFromAllWindows() {
		for (const win of Zotero.getMainWindows()) {
			this.removeFromWindow(win);
		}
	},

	findCollection(libraryID) {
		return Zotero.Collections.getByLibrary(libraryID, true).find(
			(c) => c.name === this.COLLECTION_NAME,
		);
	},

	getStatus(item) {
		const pattern = new RegExp(`^${this.STATUS_FIELD}:(.+)$`, "im");
		const match = item.getField("extra").match(pattern);
		return match ? match[1].trim() : "";
	},

	setStatus(item, status) {
		const fields = [this.STATUS_FIELD, this.DATE_FIELD];
		const lines = item
			.getField("extra")
			.split("\n")
			.filter((line) => !fields.some((f) => line.toLowerCase().startsWith(f.toLowerCase() + ":")));
		lines.push(`${this.STATUS_FIELD}: ${status}`);
		lines.push(`${this.DATE_FIELD}: ${new Date().toISOString()}`);
		item.setField("extra", lines.join("\n").replace(/^\n+/, ""));
	},

	async candidates(libraryID, collection) {
		const search = new Zotero.Search({ libraryID });
		for (const type of ["attachment", "note", "annotation"]) {
			search.addCondition("itemType", "isNot", type);
		}
		const ids = await search.search();
		const items = await Zotero.Items.getAsync(ids);
		return items.filter(
			(item) =>
				item.isRegularItem() &&
				!item.deleted &&
				!collection.hasItem(item.id) &&
				!this.SKIP_STATUSES.includes(this.getStatus(item)),
		);
	},

	async pick(win) {
		const libraryID = Zotero.Libraries.userLibraryID;
		try {
			const collection = this.findCollection(libraryID);
			if (!collection) {
				this.notify(`No collection named "${this.COLLECTION_NAME}" found.`);
				return;
			}

			const pool = await this.candidates(libraryID, collection);
			if (!pool.length) {
				this.notify("No unread items are left to pick from.");
				return;
			}

			const item = pool[Math.floor(Math.random() * pool.length)];
			item.addToCollection(collection.id);
			this.setStatus(item, this.NEW_STATUS);
			await item.saveTx();

			await win.ZoteroPane.collectionsView.selectCollection(collection.id);
			await win.ZoteroPane.selectItem(item.id);
			this.notify(item.getDisplayTitle(), `Picked 1 of ${pool.length}`);
		} catch (e) {
			Zotero.logError(e);
			this.notify(`Error: ${e.message}`);
		}
	},

	notify(text, headline = "Random Read") {
		const progress = new Zotero.ProgressWindow({ closeOnClick: true });
		progress.changeHeadline(headline);
		progress.addDescription(text);
		progress.show();
		progress.startCloseTimer(5000);
	},
};

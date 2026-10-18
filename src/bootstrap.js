/* Zotero 7+ bootstrapped plugin entry point. */

var chromeHandle;

function install() {}

async function startup({ rootURI }) {
	await Zotero.initializationPromise;

	const aomStartup = Cc["@mozilla.org/addons/addon-manager-startup;1"].getService(
		Ci.amIAddonManagerStartup,
	);
	const manifestURI = Services.io.newURI(rootURI + "manifest.json");
	chromeHandle = aomStartup.registerChrome(manifestURI, [
		["content", "random-read", rootURI + "content/"],
	]);

	Services.scriptloader.loadSubScript(rootURI + "content/random-read.js");
	Zotero.RandomRead.init();
	for (const win of Zotero.getMainWindows()) {
		Zotero.RandomRead.addToWindow(win);
	}
}

function onMainWindowLoad({ window }) {
	Zotero.RandomRead?.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	Zotero.RandomRead?.removeFromWindow(window);
}

function shutdown(data, reason) {
	if (reason === APP_SHUTDOWN) {
		return;
	}
	Zotero.RandomRead?.removeFromAllWindows();
	delete Zotero.RandomRead;
	if (chromeHandle) {
		chromeHandle.destruct();
		chromeHandle = null;
	}
}

function uninstall() {}

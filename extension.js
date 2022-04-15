// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function parseDate(date) {
	return new Date(date).toLocaleString();
}

function init() {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await axios.get("https://api.coin-stats.com/v2/markets?coinId=radio-caca&skip=0&limit=10");
			let dataGateio = data.data.markets.find(x => x.exchangeId == "gateio");
			let racaPrice = dataGateio.price;
			let updated = parseDate(new Date());
			vscode.window.setStatusBarMessage(`RACA: ${racaPrice} - Updated: ${updated}`);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let interval = null;
	try {
		init();
		interval = setInterval(() => {
			init();
		}, 60000);
	} catch (err) {
		console.log('====================================');
		console.log(err);
		console.log('====================================');
		clearInterval(interval);
	}
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

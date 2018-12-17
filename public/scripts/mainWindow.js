const electron = require('electron');
const windowState = require('./windowState');
const utils = require('./utils');
const path = require('path');
const isDev = require('electron-is-dev');
const {globalShortcut} = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const createWindowStateKeeper = windowState.winState;
const whenReady = utils.whenReady;
const whenReadyToShow = utils.whenReadyToShow;

let mainWindow = null;

let state = {
	hideOnClose: false,
};

const mainWindowOptions = {
  height: 680,
  width: 900,
  webPreferences: {
    sandbox: false,
    webSecurity: false
  },
};

const setState = (partialState) => {
	state = {
		...state,
		...partialState,
	};
};

const attachWindowStateHandling = (mainedWindow) => {
	const windowStateKeeper = createWindowStateKeeper('main', mainWindowOptions);
	whenReadyToShow(mainedWindow).then(() => windowStateKeeper.loadState(mainedWindow));

	const exitFullscreen = () => new Promise((resolve) => {
		if (mainedWindow.isFullScreen()) {
			mainedWindow.once('leave-full-screen', resolve);
			mainedWindow.setFullScreen(false);
			return;
		}
		resolve();
	});

	const close = () => {
		if (process.platform === 'darwin' || state.hideOnClose) {
			mainedWindow.hide();
		} else {
			app.quit();
		}
	};

	app.on('activate', () => mainedWindow.show());
	app.on('before-quit', () => {
		windowStateKeeper.saveState.flush();
		mainedWindow = null;
	});

	mainedWindow.on('resize', () => {
		windowStateKeeper.saveState(mainedWindow);
	});
	globalShortcut.register('ctrl+shift+1', function () {
		mainedWindow.webContents.send('zoomIn' , {msg:'hello from main process'});
	});
	globalShortcut.register('ctrl+shift+2', function () {
		mainedWindow.webContents.send('zoomOut' , {msg:'hello from main process'});
	});
	mainedWindow.on('move', () => windowStateKeeper.saveState(mainedWindow));
	mainedWindow.on('show', () => windowStateKeeper.saveState(mainedWindow));
	mainedWindow.on('close', async(event) => {
		if (!mainedWindow) {
			return;
		}

		event.preventDefault();
		await exitFullscreen();
		close();
		windowStateKeeper.saveState(mainedWindow);
	});

	mainedWindow.on('set-state', setState);
};

const getMainWindow = async() => {
	await whenReady();

	if (!mainWindow) {
		mainWindow = new BrowserWindow(mainWindowOptions);
		mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
		mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../../build/index.html')}`);
		attachWindowStateHandling(mainWindow);
	}

	return mainWindow;
};

module.exports = { getMainWindow };

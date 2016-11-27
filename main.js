require('dotenv').config();

const electron = require('electron');
const path = require('path');
const url = require('url');

// Module to control application life.
const {app, BrowserWindow, Tray} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, appIcon;

const iconFilePath = path.join(__dirname, 'app.ico');

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        icon: iconFilePath,
        width: 800,
        height: 600,
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden'
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.on('minimize', () => {
        mainWindow.hide();
    });
}

function createTray() {
    appIcon = new Tray(iconFilePath);
    appIcon.setToolTip('Password Manager');

    appIcon.on('click', () => {
        if (mainWindow && !mainWindow.isVisible()) {
            mainWindow.show();
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createTray();
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const esClient = require('./lib/connection.js');
const crypto = require('./lib/crypto-utils');

const {ipcMain} = electron;

ipcMain.on('save-entry', (event, entry) => {
    entry.encPassword = crypto.encrypt(entry.password);
    entry.password = '--encrypted--';

    let p;

    if (!entry.id) {
        p = esClient.index({index: 'sites', type: 'credentials', body: entry});
    } else {
        let _id = entry.id;
        delete entry.id;

        p = esClient.update({index: 'sites', type: 'credentials', id: _id,
                body: {
                    doc: entry
                }
            });
    }

    p.then((resp) => {
        entry.id = resp['_id'];
        event.returnValue = true;
    }).catch((err) => {
        console.error(err);
        event.returnValue = false;
    });
});

ipcMain.on('search', (event, terms) => {
    esClient.search({index: 'sites', type: 'credentials',
        body: {
            query: {
                match: { "name": terms }
            }
        }
    }).then((resp) => {
        resp.hits.hits.forEach((hit) => {
            let rec = hit['_source'];
            if (rec.password === '--encrypted--') rec.password = crypto.decrypt(rec.encPassword);
        });

        event.returnValue = resp.hits.hits;
    }).catch((err) => {
        console.error(err);
        event.returnValue = [];
    });
});


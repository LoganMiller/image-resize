const { app, BrowserWindow } = require('electron');

function createWindow() {

    let win = new BrowserWindow({ width: 600, height: 600});

    win.loadFile('mainWindow.html');
}

app.on('ready', createWindow);
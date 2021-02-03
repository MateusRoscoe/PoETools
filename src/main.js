
const fs = require('fs')
const webpage = require('./webpage.js')
const config = require('../data/config.json')
const checkVersion = require('./checkversion.js')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

var mainWindow
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.once('dom-ready', () => {
        loadFile()
    })
    /*
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
    */
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)


const mainMenuTemplate = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Quit',
                click() {
                    app.quit()
                }
            },
            {
                label: 'Login',
                click() {
                    webpage.doLogin()
                }
            },
            {
                label: "Check Latest Version",
                click() {
                    // TODO add some alert/warning when it finishes checking for the filter and possibly an windows alert when it finds an update.
                    checkVersion.checkFilter()
                }
            },
            {
                label: "Dev Tools",
                click() {
                    mainWindow.openDevTools()
                }
            }
        ]
    }
]

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('asynchronous-message', (event, message) => {
    // Parse message into command and parameter
    console.log('Received asynchronous message with ' + message)
    let command = message[0]
    console.log('command = ' + command)

    // check which command it is and execute it's function
    if (command == 'updateFilter') {
        console.log('updateFilter slots ' + message[1] + ' and ' + message[2])
        webpage.updateFilter(message[1], message[2])
    }
    else if (command == 'saveJson') {
        message.shift()
        saveJson(message)
    }
    else if (command == 'loadFile') {
        loadFile()
    }
    else {
        console.log('Command not found')
    }
})

function sendUpdate(value) {
    mainWindow.webContents.send('update', value)
}

function loadFile() {
    let value = []
    value.push(config.lastUpdatedOn)
    value.push(config.currentVersion)
    value.push(config.latestFilterVersion)
    mainWindow.webContents.send('loadFile', value)
}
function saveJson(value) {
    console.log(value)

    config.lastUpdatedOn = value[0]
    config.currentVersion = value[1]
    config.latestFilterVersion = value[2]

    fs.writeFile(path.join(__dirname, '..', '/data/config.json'), JSON.stringify(config, null, 2), function writeJSON(err) {
        if (err) return console.log(err)
        console.log(JSON.stringify(config))
        console.log('writing to ' + path.join(__dirname, '..', '/data/config.json'))
    })
}
exports.sendUpdate = sendUpdate
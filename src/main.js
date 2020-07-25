const webpage = require('./webpage.js')
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path');
const url = require('url');

var mainWindow
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        // show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })
    
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// toDO
const mainMenuTemplate = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Quit',
                click() {
                    app.quit();
                }
            },
            {
                label: 'Login',
                click(){
                    webpage.doLogin()
                }
            },
            {
                label: "Dev Tools",
                click() {
                    mainWindow.openDevTools();
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
    let command = message.substr(0, message.indexOf(' ')) // command to execute
    let param = message.substr(message.indexOf(' ') + 1) // parameters of the command
    console.log(`command = ${command} param = ${param}`);
    
    // check which command it is and execute it's function
    if (command == 'updateFilter'){
        param = param.split(' ')
        webpage.updateFilter(param[0], param[1])
    }
    else{
        console.log('Command not found');
    }
});

function sendUpdate(value) {
    mainWindow.webContents.send('update', value)
}

function updateDefault(value) {
    mainWindow.webContents.send('updateDefault', value)
}

exports.sendUpdate = sendUpdate
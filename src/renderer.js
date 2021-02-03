
const { ipcRenderer } = require('electron')
// Hooking variables to HTML elements.
var saveSlotFB = document.getElementById('saveSlotFB')
var saveSlotPoE = document.getElementById('saveSlotPoE')
var btnUpdate = document.getElementById('btnUpdateFilter')
var lastUpdated = document.getElementById('lastUpdated')
var updateStatus = document.getElementById('updateStatus')
var currentVersion = document.getElementById('currentVersion')
var latestFilterVersion = document.getElementById('latestFilterVersion')
var lastUp
var currentVer
var latestFV

btnUpdate.addEventListener('click', function () {
    let slot1 = saveSlotFB.value
    let slot2 = saveSlotPoE.value
    if (slot1 > 0 && slot1 < 16 && slot2 > 0 && slot2 < 16) {
        ipcRenderer.send('asynchronous-message', ['updateFilter', saveSlotFB.value, saveSlotPoE.value])
    }
    else {
        console.log('Numbers for save slots are invalid.')
    }
})


// Handling message communication with main process.

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log("Received reply with " + arg) // prints reply
})

// message[0] contains what to update
// message[X+1] contains what to change to

ipcRenderer.on('update', (event, message) => {
    // Parse message into command and parameter
    let command = message[0]
    console.log('command = ' + command)

    if (command == 'lastUpdated') {

        console.log('Changing lastUpdated date to ' + message[1])
        lastUpdated.innerHTML = 'Last updated on : ' + message[1]
        lastUp = message[1]

        console.log('Changing currentVersion to ' + message[2])
        currentVersion.innerHTML = 'Current filter version is : ' + message[2]
        currentVer = message[2]
        saveJson()
    }
    else if (command == 'updateStatus') {
        updateStatus.innerHTML = message[1]
    }
    else if (command == 'latestFilter') {
        console.log('Changing latestFilterVersion to ' + message[1])
        latestFilterVersion.innerHTML = 'Latest filter version on filterblade.xyz is : ' + message[1]
        latestFV = message[1]
        saveJson()
    }
    else if (command == 'createAlert') {
        console.log('Alerting with ' + message[1])
        window.alert(" " + message[1])
    }
    else {
        console.log('Command not found on renderer.js')
    }
})
ipcRenderer.on('loadFile', (event, message) => {
    console.log('Loading data from config.json')
    lastUp = message[0]
    currentVer = message[1]
    latestFV = message[2]

    lastUpdated.innerHTML = 'Last updated on : ' + lastUp
    currentVersion.innerHTML = 'Current filter version is : ' + currentVer
    latestFilterVersion.innerHTML = 'Latest filter version on filterblade.xyz is : ' + latestFV
})

function saveJson() {
    ipcRenderer.send('asynchronous-message', ['saveJson', lastUp, currentVer, latestFV])
}
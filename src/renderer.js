const { ipcRenderer } = require('electron');
// Hooking variables to HTML elements.
var saveSlotFB = document.getElementById('saveSlotFB')
var saveSlotPoE = document.getElementById('saveSlotPoE')
var btnUpdate = document.getElementById('btnUpdateFilter')
var lastUpdated = document.getElementById('lastUpdated')
var updateStatus = document.getElementById('updateStatus')

btnUpdate.addEventListener('click', function(){
    let slot1 = saveSlotFB.value
    let slot2 = saveSlotPoE.value
    if (slot1 > 0 && slot1 < 16 && slot2 > 0 && slot2 <16){
        ipcRenderer.send('asynchronous-message',`updateFilter ${saveSlotFB.value} ${saveSlotPoE.value}`)
    }
    else{
        console.log('Numbers for save slots are invalid.')
    }
})


// Handling message communication with main process.

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log("Received reply with " + arg) // prints reply
});

// command contains what to update
// param contains what to change to
ipcRenderer.on('update', (event, message) => {
    // Parse message into command and parameter
    let command = message.substr(0, message.indexOf(' ')) // command to execute
    let param = message.substr(message.indexOf(' ') + 1) // parameters of the command
    console.log(`command = ${command} param = ${param}`);

    if(command == 'lastUpdated'){
        console.log('Changing lastUpdated date to ' +param);
        lastUpdated.innerHTML = 'Last updated on : '+ param
    }
    else if(command == 'updateStatus'){
        updateStatus.innerHTML = param
    }
    else{
        console.log('Command not found on renderer.js');
    }
});

ipcRenderer.on('updateDefault', (event, arg) => {
    // sets default values saved in some file
});

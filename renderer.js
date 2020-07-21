const webpage = require('./webpage.js')
// Hooking variables to HTML elements.
var saveSlotFB = document.getElementById("saveSlotFB")
var saveSlotPoE = document.getElementById("saveSlotPoE")
var btnUpdate = document.getElementById("btnUpdateFilter")

btnUpdate.addEventListener("click", function(){
    let slot1 = saveSlotFB.value
    let slot2 = saveSlotPoE.value
    if (slot1 > 0 && slot1 < 16 && slot2 > 0 && slot2 <16){
        webpage.updateFilter(saveSlotFB.value, saveSlotPoE.value)
    }
    else{
        console.log("Numbers for save slots are invalid.")
    }
})


// Handling message communication with main process.
const { ipcRenderer } = require('electron');

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log("Received reply with " + arg) // prints reply
});

ipcRenderer.on('update', (event, arg) => {
    // Do something with the message received
});

ipcRenderer.on('updateDefault', (event, arg) => {
    // sets default values saved in some file
});

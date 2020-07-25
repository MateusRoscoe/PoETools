
const puppeteer = require('puppeteer');
const main = require ('./main.js')
const filterblade = 'https://www.filterblade.xyz'
class Webpage {
    static async updateFilter(slotFB, slotPoE) {
        
        var saveSlotFB = slotFB - 1 // valid numbers are 0~14
        var saveSlotPoE = slotPoE - 1 // valid numbers are 0~14?
        console.log(`SlotFB = ${saveSlotFB} \nSlotPoE = ${saveSlotPoE}`);
        main.sendUpdate('updateStatus Update in process now')
        // Launching browser and navigatin to site.
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: './user_data'
        });
        const page = await browser.newPage()
        await page.goto(filterblade)
        try {
            // Waiting for page to load properly
            await page.waitForSelector('button[id="SelectionButton5"]')
            await new Promise(r => setTimeout(r, 2000))
            // Checking if is logged in
            await page.waitForSelector('div[id=loginSessionInfo]', {
                visible: true,
                timeout: 5000,
            })
            // Navigating to Load Filter section
            await page.click('button[id="SelectionButton5"]')
            // Clicking to load desired filter.
            let nextButtonId = 'LoadProfileSaveState' + saveSlotFB
            await page.waitForSelector('button[id="'+nextButtonId+'"]')
            await page.click('button[id="' + nextButtonId + '"]')
            // Waiting for filter to load and possibly update
            await page.waitForSelector('div.smallMessageBox')
            console.log('Save state successfully loaded.')
            // Syncing with PoE
            await page.click('a[href = "#"]')
            await page.click('button[id="uploadFilterToPoeButton"]')
            await page.waitForSelector('button[id="UpdatePoeFilterContent' + saveSlotPoE + '"]')
            await page.click('button[id="UpdatePoeFilterContent'+ saveSlotPoE +'"]')
            
            // toDO check if it's possible that the update fails and an error message is displayed as a label
            // Wait for success message + 2s then close the browser
            await page.waitForSelector('div.smallMessageBox')
            console.log("Job finished, filter updated.")

            // Updating date of change
            let date = new Date()
            const options = { month: 'short', day: 'numeric' , hour:'numeric', minute:'numeric'}
            let now = date.toLocaleDateString('en-US', options)
            main.sendUpdate('lastUpdated ' + now)
            main.sendUpdate('updateStatus Update completed successfully')

            // closing browser
            await new Promise(r => setTimeout(r, 5000))
            browser.close()
        }
        // Handling possible errors
        catch (err) {
            // Not logged in
            if (err.message.includes('waiting for selector "div[id=loginSessionInfo]" failed')){
                console.log("User not logged in to filterblade.xyz");
                browser.close()
                main.sendUpdate('updateStatus Update failed user not logged in')
                this.doLogin()
            }
            // Don't know which error happened, just log and move on
            else{
                console.log(err)
                main.sendUpdate('updateStatus Update failed for unkown reason, make sure filterblade.xyz is up and try again')
                browser.close()
            }
        }
    }
    
    static async doLogin(){ // Start a new session with a visible browser that the user can log in and save the data
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: './user_data'
        });
        const page = await browser.newPage()
        await page.goto(filterblade)
    }
}

module.exports = Webpage;
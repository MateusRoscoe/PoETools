
const puppeteer = require('puppeteer')
const main = require('./main.js')
const filterblade = 'https://www.filterblade.xyz'
class Webpage {
    static async updateFilter(slotFB, slotPoE) {

        var saveSlotFB = slotFB - 1 // valid numbers are 0~14
        var saveSlotPoE = slotPoE - 1 // valid numbers are 0~14?
        console.log(`SlotFB = ${saveSlotFB} \nSlotPoE = ${saveSlotPoE}`)
        main.sendUpdate(['updateStatus', 'Update in progress now'])
        // Launching browser and navigatin to site.
        const browser = await puppeteer.launch({
            product: 'chrome',
            // TODO : Try to check if I can click in headless : true mode and use delays between clicks to wait for the page to update.
            headless: false, // does not work in headless mode as I need to check for visual elements to be displayed to navigate the page.
            userDataDir: './user_data',
            args: [
                // These 3 args make so chrome doesn't throttle the tab if it's in the background, it's not working all the time, it's an issue with puppeteer/chromium
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--start-maximised'
            ]
        })
        const page = (await browser.pages())[0]
        await page.goto(filterblade)
        try {
            // Waiting for page to load properly
            await page.waitForSelector('button[id="SelectionButton5"]')
            await new Promise(r => setTimeout(r, 5000))
            console.log('Page Loaded')
            // Checking if is logged in
            await page.waitForSelector('div[id=loginSessionInfo]', {
                visible: true,
                timeout: 5000,
            })

            // Getting current filter version.
            var element = await page.$eval('#FilterInfo_Description', el => el.textContent)
            let start = element.indexOf("version")
            let currentVersion = element.slice(start + 8, start + 16).split(" ")[0]
            currentVersion = currentVersion.replace(",", "")
            console.log(currentVersion)
            await new Promise(r => setTimeout(r, 500))

            // Navigating to Load Filter section
            await page.click('button[id="SelectionButton5"]')

            // Clicking to load desired filter.
            let nextButtonId = 'LoadProfileSaveState' + saveSlotFB
            console.log(nextButtonId);
            await page.waitForSelector('button[id="' + nextButtonId + '"]', {
                visible: true,
                timeout: 5000,
            })
            await page.click('button[id="' + nextButtonId + '"]')

            // Waiting for filter to load and possibly update
            await page.waitForSelector('div[class=smallMessageBox]', {
                visible: true,
                timeout: 5000,
            })
            console.log('Save state successfully loaded.')

            // Getting to sync with PoE interface
            await page.click('button[id="SelectionButton6"')
            await page.click('button[id="downloadScreen_tabButton_0"')
            await page.click('button[id="uploadFilterToPoeButton"]')

            // Syncing with PoE
            await page.waitForSelector('button[id="UpdatePoeFilterContent' + saveSlotPoE + '"]', {
                visible: true,
                timeout: 5000,
            })
            await page.click('button[id="UpdatePoeFilterContent' + saveSlotPoE + '"]')

            // Wait for success message
            await page.waitForSelector('div.smallMessageBox', {
                visible: true,
                timeout: 5000,
            })
            console.log("Job finished, filter updated.")

            // Updating date of change
            let date = new Date()
            const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            let now = date.toLocaleDateString('en-US', options)
            main.sendUpdate(['lastUpdated', now, currentVersion])
            main.sendUpdate(['updateStatus', 'Update completed successfully'])
            main.sendUpdate(['createAlert', 'Filter succesfully updated.'])

            // closing browser
            await new Promise(r => setTimeout(r, 10000)) // TODO remove this when deploying app and confidence on failuer checking is high.
            browser.close()
        }
        catch (err) {
            browser.close()
            this.handleLoginError(err)
        }
    }

    static async handleLoginError(error) {
        // Checking if not logged in error happened
        if (error.message.includes('waiting for selector "div[id=loginSessionInfo]" failed')) {
            console.log("User not logged in to filterblade.xyz")
            main.sendUpdate(['updateStatus', 'Update failed user not logged in'])
            this.doLogin()
        }
        // Don't know which error happened, just log and move on
        else {
            console.log(error)
            main.sendUpdate(['updateStatus', 'Update failed for unkown reason, make sure filterblade.xyz is up and try again'])
        }
    }

    static async doLogin() { // Start a new session with a visible browser that the user can log in and save the data
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: './user_data'
        })
        const page = await browser.newPage()
        await page.goto(filterblade)
    }
}

module.exports = Webpage
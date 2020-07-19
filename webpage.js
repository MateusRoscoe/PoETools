const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
class Webpage {
    static async updateFilter() {
        var url = 'https://www.filterblade.xyz'
        var hasLogin = true // toDO implement a method to detect if login data is present or not.

        var saveSlotFB = '1' // valid numbers are 0~14
        var saveSlotPoE = '2' // valid numbers are 0~14?

        // Launching browser and navigatin to site.
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: './user_data'
        });
        const page = await browser.newPage()
        await page.goto(url)
        if (hasLogin == true) {
            try {
                // Navigating to Load Filter section
                await page.waitForSelector('button[id="SelectionButton5"]')
                await new Promise(r => setTimeout(r, 2000))
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
                await new Promise(r => setTimeout(r, 2000))
                console.log("Job finished, filter updated.")
                browser.close()
            }
            catch (err) {
                console.log(err)
                //console.log("Não foi possível buscar os dados desejados.")
            }
        }
        else{ // do login
            console.error("Not logged in.");
        }
    }
}

module.exports = Webpage;
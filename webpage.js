const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
class Webpage {
    static async fetch() {
        var url = "https://www.filterblade.xyz"
        var hasLogin = true // implement a method to detect if login data is present or not.
        var saveStateFB = '1' // valid numbers are 0~14

        // Launching browser and navigatin to site.
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: "./user_data"
        });
        const page = await browser.newPage()
        await page.goto(url)
        if (hasLogin == true) {
            try {
                // Navigating to Load Filter section
                await page.waitForSelector('button[id="SelectionButton5"]')
                await new Promise(r => setTimeout(r, 2000));
                await page.click('button[id="SelectionButton5"]')
                // Clicking to load desired filter.
                let nextButtonId = "LoadProfileSaveState" + saveStateFB
                await page.waitForSelector('button[id="'+nextButtonId+'"]')
                await page.click('button[id="' + nextButtonId + '"]')
                // Waiting for filter to load and possibly update
                await page.waitForSelector('div.smallMessageBox')
                console.log("Save state successfully loaded.")

                // toDo sync with PoE.
            }
            catch (err) {
                console.log(err)

                //console.log("Não foi possível buscar os dados desejados.")
            }
        }
        else{ // do login

        }
    }
    static sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}
}

module.exports = Webpage;
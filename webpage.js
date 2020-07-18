const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
class Webpage {
    static async fetch() {
        var url = ""

        // Launching browser and navigatin to site.
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage()
        await page.goto(url)
        try {
            await page.waitForSelector(".left", {
                visible: true,
                timeout: 9000
            })

            // Getting site content and parsing.
            let bodyHTML = await page.evaluate(() => document.body.innerHTML)
        }
        catch (err) {
            console.log(err)

            //console.log("Não foi possível buscar os dados desejados.")
        }
    }
}

module.exports = Webpage;
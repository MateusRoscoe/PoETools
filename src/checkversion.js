const fetch = require('node-fetch')
const main = require('./main')
const config = require('../data/config.json')
class CheckVersion {
    static checkFilter() {
        fetch('https://raw.githubusercontent.com/NeverSinkDev/NeverSink-Filter/master/CHANGELOG.txt')
            .then(res => res.text())
            .then(body => {
                let start = body.indexOf("version")
                this.compareVersion(body.slice(start + 8, start + 16).split(" ")[0])
            })
    }
    static compareVersion(latest) {
        main.sendUpdate(['latestFilter', latest])
        let current = config.currentVersion
        console.log(current)
        console.log(latest)
        if (parseInt(current.split('.').join("")) < parseInt(latest.split('.').join(""))) {
            console.log('Your current version is outdated, please update the filter.')
        }
        else {
            console.log('Up to date.')
        }
    }
}

module.exports = CheckVersion
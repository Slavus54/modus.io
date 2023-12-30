import {checkTownTitles, checkTelegramTag, town_titles, tags} from '../test-api'

describe('Data validation in register component', () => {
    it(`Enter ${town_titles.length} times and search town by title`, () => {
        let percent = 50
        
        town_titles.map(el => expect(checkTownTitles(el, percent)).toBe(true))
    })

    it('Telegram tags validation', () => {
        tags.map(el => expect(checkTelegramTag(el)).toBe(true))
    })
})
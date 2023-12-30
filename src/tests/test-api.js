const TOWNS = require('../env/towns.json')
const {TIME_BORDERS} = require('../env/env')
const Centum = require('centum.js')
const {Datus} = require('datus.js')

const centum = new Centum()
const datus = new Datus()
const town_titles = ['Харьков', 'харьков', 'харьк']
const tags = ['@GLVVLGY', '@Slavus54']
const original = TOWNS[0].title
const times = new Array(5).fill(null).map(el => centum.time(Math.random() * TIME_BORDERS[1], 'convert'))
const dates = new Array(5).fill(null).map(el => datus.move())

const checkTownTitles = ({title, percent}) => {
    return centum.search([original, title], percent) !== undefined
}

const checkTelegramTag = (tag) => {
    return tag.includes('@')
}

const checkTimeValidation = time => {
    let flag = typeof time === 'string'

    return flag
}

const checkDateValidation = date => {
    let flag = typeof date === 'string'

    flag = date.split('.').length === 3

    return flag
}

module.exports = {town_titles, tags, times, dates, checkTownTitles, checkTelegramTag, checkTimeValidation, checkDateValidation}
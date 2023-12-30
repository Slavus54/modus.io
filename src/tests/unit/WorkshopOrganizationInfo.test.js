import {times, dates, checkTimeValidation, checkDateValidation} from '../test-api'

describe('Workshop organization info validation', () => {
    test('When it will start?', () => {
        times.map(el => expect(checkTimeValidation(el)).toBe(true))
    })

    test('In what day it will be?', () => {
        dates.map(el => expect(checkDateValidation(el)).toBe(true))
    })
})
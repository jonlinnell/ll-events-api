const { formatDate, scrubInput, coerceDate } = require('./events')
const testData = require('./testData.json')

describe('formatDate', () => {
  it(`Should return a formatted date/time string`, () => {
    const {date, time} = testData[0]

    expect(formatDate({ date, time }))
      .toEqual('21 September 2018, 9.00am-5.00pm')
  })

  it(`Should return a formatted date/time string from spaced, linebreaked input`, () => {
    const {date, time} = testData[1]

    expect(formatDate({ date, time }))
      .toEqual('22 October 2018 - 23 October 2018, 2pm-7pm/11am-4pm')
  })
})

describe('scrubInput', () => {
  it(`Should return a trimmed string`, () => {
    expect(scrubInput("   2 September 2018       "))
      .toBe('2 September 2018')
  })

  it(`Should return a trimmed string with no linebreak characters`, () => {
    expect(scrubInput("   \n2 September 2018\n       "))
      .toBe('2 September 2018')
  })

  it(`Should return a trimmed string with no linebreak characters or extraneous whitespace`, () => {
    expect(scrubInput("   \n         \n        2 September 2018\n         \n       "))
      .toBe('2 September 2018')
  })
})

describe('coerceDate', () => {
  it(`Should return a valid date object from a single date`, () => {
    expect(coerceDate(testData[0].date))
      .toBe("2018-09-21T00:00:00+01:00")
  })

  it(`Should return a valid date object from a date range input`, () => {
    expect(coerceDate(testData[2].date))
      .toBe("2018-09-24T00:00:00+01:00")
  })

  it(`Should return a valid date object from a really messy date range input`, () => {
    expect(coerceDate(testData[1].date))
      .toBe("2018-10-22T00:00:00+01:00")
  })
})
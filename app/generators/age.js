import { DateTime, Interval } from 'luxon'

const yearGroupRange = (startYear) => {
  const startDate = DateTime.fromISO(`${startYear}-09-01`)
  const endDate = DateTime.fromISO(`${startYear + 1}-08-31`)
  return {
    start: startDate.toISO(),
    end: endDate.toISO(),
    interval: Interval.fromDateTimes(startDate, endDate)
  }
}

const year0 = 2017
const yearGroups = {}
for (let i = 0; i < 13; i++) {
  yearGroups[i] = yearGroupRange(year0 - i)
}

export const getDateOfBirth = (faker, options) => {
  return faker.date.between({
    from: yearGroups[options.maxYearGroup].start,
    to: yearGroups[options.minYearGroup].end
  })
}

export const getYearGroup = (dob) => {
  const dobDate = DateTime.fromJSDate(dob)
  for (const [yearGroup, range] of Object.entries(yearGroups)) {
    if (range.interval.contains(dobDate)) {
      return yearGroup
    }
  }
}

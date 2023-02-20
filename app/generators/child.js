import { person } from './person.js'
import { parent } from './parent.js'
import { healthQuestions } from './health-questions.js'
import { DateTime, Interval } from 'luxon'
import { faker } from '@faker-js/faker'
faker.locale = 'en_GB'

const age = (dob) => {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

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

const yearGroup = (dob) => {
  const dobDate = DateTime.fromJSDate(dob)
  for (const [yearGroup, range] of Object.entries(yearGroups)) {
    if (range.interval.contains(dobDate)) {
      return yearGroup
    }
  }
}

const preferredName = (child) => {
  return `${child.firstName} ${faker.name.lastName()}`
}

const consent = (type) => {
  if (type === '3-in-1 and MenACWY') {
    const yes = { '3-in-1': 'Yes', 'men-acwy': 'Yes', both: true, text: 'Yes', responded: true }
    const no = { '3-in-1': 'No', 'men-acwy': 'No', refusedBoth: true, text: 'No', responded: true }
    const unknown = { '3-in-1': 'Unknown', 'men-acwy': 'Unknown', unknown: true, text: 'Unknown', responded: false }

    return faker.helpers.arrayElement(
      [
        yes,
        yes,
        yes,
        yes,
        yes,
        { '3-in-1': 'No', 'men-acwy': 'Yes', text: 'Only MenACWY', responded: true },
        { '3-in-1': 'Yes', 'men-acwy': 'No', text: 'Only 3-in-1', responded: true },
        unknown,
        unknown,
        unknown,
        no,
        no
      ]
    )
  }

  const r = faker.helpers.arrayElement(['Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'No'])
  return {
    [type]: r,
    responded: r !== 'Unknown'
  }
}

export const child = (options) => {
  const isChild = true
  const c = person(faker, isChild)
  const consentObj = consent(options.type)

  const dob = faker.date.between(
    yearGroups[options.maxYearGroup].start,
    yearGroups[options.minYearGroup].end
  )

  c.preferredName = faker.helpers.maybe(() => preferredName(c), { probability: 0.1 })
  // https://digital.nhs.uk/services/e-referral-service/document-library/synthetic-data-in-live-environments
  c.nhsNumber = faker.phone.number('999#######')
  c.gp = 'Local GP'
  c.dob = dob
  c.age = age(dob)
  c.yearGroup = yearGroup(dob)
  c.parentOrGuardian = parent(faker, c.lastName)
  c.consent = consentObj
  c.outcome = 'Not yet seen'
  c.seen = { text: 'Not yet', classes: 'nhsuk-tag--grey' }
  c.healthQuestions = healthQuestions(faker, options.type)

  return c
}

import school from './school.js'
import children from './children.js'
import vaccines from './vaccines.js'
import yearGroups from './year-groups.js'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
faker.locale = 'en_GB'

const generateRandomString = (length) => {
  length = length || 3
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase()
}

const ageRange = (type) => {
  switch (type) {
    case 'Flu':
      return { minYearGroup: 0, maxYearGroup: 6, type }
    case 'HPV':
      return { minYearGroup: 8, maxYearGroup: 9, type }
    case '3-in-1 and MenACWY':
      return { minYearGroup: 9, maxYearGroup: 10, type }
  }
}

export default () => {
  // const type = faker.helpers.arrayElement(['Flu', 'HPV', '3-in-1 and MenACWY'])
  const type = 'HPV'
  const vaccinesObject = vaccines(faker, type)
  const schoolObject = school(faker, type)
  const atTime = faker.helpers.arrayElement(['09:00', '10:00', '11:00', '12:30', '13:00', '14:00'])
  const daysUntil = faker.datatype.number({ min: 2, max: 100 })

  return {
    id: generateRandomString(3),
    title: `${type} session at ${schoolObject.name}`,
    location: schoolObject.name,
    date: DateTime.now().plus({ days: daysUntil }).toISODate() + 'T' + atTime,
    type,
    yearGroups: yearGroups(type),
    vaccines: vaccinesObject,
    school: schoolObject,
    isFlu: type === 'Flu',
    isHPV: type === 'HPV',
    is3in1MenACWY: type === '3-in-1 and MenACWY',
    children: children({ count: 100, child: ageRange(type) })
  }
}

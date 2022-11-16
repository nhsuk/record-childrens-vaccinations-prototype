import { person } from './person.js'
import { parentOrGuardian } from './parentOrGuardian.js'
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

const yearGroup = (dob) => {
  // TODO
}

const preferredName = (patient) => {
  return `${patient.firstName} ${faker.name.lastName()}`
}

export const patient = () => {
  const p = person(faker)
  p.dob = faker.date.birthdate({ min: 4, max: 11, mode: 'age' })
  p.age = age(p.dob)
  p.preferredName = faker.helpers.maybe(() => preferredName(p), { probability: 0.1 })
  p.yearGroup = yearGroup(p.dob)
  p.nhsNumber = faker.phone.number('##########')
  p.gp = 'Local GP'
  p.screening = 'Approved for vaccination'
  p.parentOrGuardian = parentOrGuardian(faker, p.lastName)

  return p
}

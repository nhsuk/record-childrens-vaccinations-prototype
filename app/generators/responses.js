import _ from 'lodash'
import { DateTime } from 'luxon'
import { CONSENT } from '../enums.js'
import getConsent from './consent.js'
import getRefusal from './refusal.js'
import getHealthAnswers from './health-answers.js'
import getParent from './parent.js'

export default (faker, { type, patient, count }) => {
  const responses = []

  for (let i = 0; i < count; i++) {
    const consent = getConsent(type)
    const { reason, reasonDetails } = getRefusal(type)
    const days = faker.number.int({ min: 10, max: 35 })
    const method = faker.helpers.arrayElement([
      ...Array(5).fill('Website'),
      'Text message',
      'Voice call',
      'In person',
      'Paper'
    ])

    responses.push({
      [type]: consent,
      date: DateTime.local().minus({ days }).toISODate(),
      method,
      parentOrGuardian: getParent(patient),
      healthAnswers: (consent === CONSENT.GIVEN)
        ? getHealthAnswers(faker, type, patient)
        : false,
      ...(consent === CONSENT.REFUSED) && {
        reason,
        ...reasonDetails && { reasonDetails }
      }
    })
  }

  return _.uniqBy(responses, 'parentOrGuardian.relationship')
}
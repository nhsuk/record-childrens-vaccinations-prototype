import { faker } from '@faker-js/faker'
import { PATIENT_OUTCOME, VACCINATION_OUTCOME, VACCINATION_SITE } from '../enums.js'

/**
 * Get vaccination
 * @param {Array} campaigns - Campaigns
 * @param {Array} batches - Vaccine batches
 * @returns {object} Vaccination
 */
export default (campaigns, batches) => {
  const campaign = Object
    .values(campaigns)
    .find(campaign => campaign.inProgress)
  const { children, id } = campaign

  let batch = null
  if (campaign.isFlu) {
    batch = Object
      .values(batches)
      .find(batch => batch.isFlu)
  } else if (campaign.isHPV) {
    batch = Object
      .values(batches)
      .find(batch => batch.isHPV)
  } else if (campaign.is3in1MenACWY) {
    batch = Object
      .values(batches)
      .find(batch => batch.isMenACWY || batch.is3in1)
  }

  const vaccination = {
    [id]: {}
  }

  children
    .filter(patient => patient.outcome === PATIENT_OUTCOME.VACCINATED)
    .forEach(patient => {
      vaccination[id][patient.nhsNumber] = {
        outcome: VACCINATION_OUTCOME.VACCINATED,
        site: VACCINATION_SITE.ARM_LEFT,
        batch: batch.name
      }
    })

  children
    .filter(patient => patient.outcome === PATIENT_OUTCOME.COULD_NOT_VACCINATE)
    .forEach(patient => {
      vaccination[id][patient.nhsNumber] = {
        outcome: faker.helpers.arrayElement([
          VACCINATION_OUTCOME.CONTRAINDICATIONS,
          VACCINATION_OUTCOME.REFUSED,
          VACCINATION_OUTCOME.ABSENT,
          VACCINATION_OUTCOME.UNWELL,
          VACCINATION_OUTCOME.NO_CONSENT,
          VACCINATION_OUTCOME.LATE_CONSENT
        ])
      }
    })

  return vaccination
}

import { wizard } from 'nhsuk-prototype-rig'
import _ from 'lodash'

const getData = (data, keyPath) => {
  return _.get(data, _.toPath(keyPath))
}

const journeyFor3in1MenAcwy = (req, campaign, child) => {
  const campaignId = campaign.id
  const nhsNumber = child.nhsNumber
  const whichVaccinations = Object.keys(child.consent).filter(key => {
    return child.consent[key] && key !== 'both'
  })
  const isBoth = child.consent.both

  let vaccinationOrder = whichVaccinations
  if (isBoth) {
    const whichFirst = getData(req.session.data, `vaccination.${campaignId}.${nhsNumber}.which-first`)

    switch (whichFirst) {
      case '3-in-1':
        vaccinationOrder = ['3-in-1', 'men-acwy']
        break
      default:
        vaccinationOrder = ['men-acwy', '3-in-1']
        break
    }
  }

  const firstVaccineGiven = getData(req.session.data, `${vaccinationOrder[0]}-vaccination.${campaignId}.${nhsNumber}.given`) !== 'No'
  const secondVaccineGiven = isBoth && getData(req.session.data, `${vaccinationOrder[1]}-vaccination.${campaignId}.${nhsNumber}.given`) !== 'No'

  return {
    ...isBoth ? {
      [`/vaccination/${campaignId}/${nhsNumber}/which-first`]: {}
    } : {},
    [`/${vaccinationOrder[0]}-vaccination/${campaignId}/${nhsNumber}`]: {},
    [`/${vaccinationOrder[0]}-vaccination/${campaignId}/${nhsNumber}/has-it-been-given`]: {
      [`/vaccination/${campaignId}/${nhsNumber}/details`]: () => {
        return !isBoth && firstVaccineGiven
      },
      [`/${vaccinationOrder[1]}-vaccination/${campaignId}/${nhsNumber}`]: () => {
        return isBoth && firstVaccineGiven
      }
    },
    [`/${vaccinationOrder[0]}-vaccination/${campaignId}/${nhsNumber}/not-given`]: {},
    ...isBoth
      ? {
        [`/${vaccinationOrder[1]}-vaccination/${campaignId}/${nhsNumber}`]: {},
        [`/${vaccinationOrder[1]}-vaccination/${campaignId}/${nhsNumber}/has-it-been-given`]: {
          [`/vaccination/${campaignId}/${nhsNumber}/details`]: secondVaccineGiven
        },
        [`/${vaccinationOrder[1]}-vaccination/${campaignId}/${nhsNumber}/not-given`]: {}
      } : {}
  }
}

export function vaccination (req) {
  const nhsNumber = req.params.nhsNumber
  const campaignId = req.params.campaignId
  const data = req.session.data
  const campaign = data.campaigns[campaignId]
  const child = campaign.children.find(p => p.nhsNumber === req.params.nhsNumber)

  const journey = {
    [`/campaign/${campaignId}/child/${nhsNumber}`]: {
      [`/vaccination/${campaignId}/${nhsNumber}/details`]: {
        data: `vaccination.${campaignId}.${nhsNumber}.given`,
        excludedValue: 'No'
      }
    },
    ...campaign.is3in1MenACWY
      ? journeyFor3in1MenAcwy(req, campaign, child)
      : {
        [`/vaccination/${campaignId}/${nhsNumber}/not-given`]: {}
      },
    [`/vaccination/${campaignId}/${nhsNumber}/details`]: {},
    [`/campaign/${campaignId}/children?success=${nhsNumber}`]: {}
  }

  return wizard(journey, req)
}

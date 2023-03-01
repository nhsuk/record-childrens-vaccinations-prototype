import { TRIAGE, OUTCOME, CONSENT } from '../enums.js'
import _ from 'lodash'

const filters = {
  year: (children, yearGroup) => {
    return children.filter((c) => {
      return c.yearGroup === yearGroup
    })
  },
  'triage-status': (children, triageStatus, req, res) => {
    return children.filter((c) => {
      const triageRecord = req.session.data.triage[res.locals.campaign.id]
      if (triageRecord && triageRecord[c.nhsNumber]) {
        return triageRecord[c.nhsNumber].status === TRIAGE[triageStatus]
      }

      return c.triageStatus === TRIAGE[triageStatus]
    })
  },
  outcome: (children, outcome) => {
    return children.filter((c) => {
      return c.outcome === OUTCOME[outcome]
    })
  },
  medical: (children, medical) => {
    return children.filter((c) => {
      const hasAnswers = c.healthQuestions.hasAnswers && c.consent.consented
      return medical === 'true' ? hasAnswers : !hasAnswers
    })
  },
  consent: (children, consent) => {
    return children.filter((c) => {
      return c.consent.text === CONSENT[consent]
    })
  }
}

const filter = (children, filterName, value, req, res) => {
  return filters[filterName](children, value, req, res)
}

export default (req, res) => {
  const query = req.query
  const children = res.locals.campaign.children

  const activeFilters = Object.keys(filters).reduce((acc, f) => {
    if (query[f]) {
      acc[f] = query[f]
    }
    return acc
  }, {})

  if (_.isEmpty(activeFilters)) {
    return false
  }

  let filteredChildren = children
  for (const f in activeFilters) {
    filteredChildren = filter(filteredChildren, f, activeFilters[f], req, res)
  }

  return filteredChildren
}
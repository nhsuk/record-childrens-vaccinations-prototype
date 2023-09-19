import { vaccination } from '../wizards/vaccination.js'
import { ACTION_TAKEN } from '../enums.js'
import _ from 'lodash'

export default (router) => {
  router.all([
    '/3-in-1-vaccination/:campaignId/',
    '/3-in-1-vaccination/:campaignId/:nhsNumber',
    '/3-in-1-vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res, next) => {
    res.locals.type = '3-in-1'
    res.locals.dataLocation = '3-in-1-vaccination'
    res.locals.is3in1 = true
    next()
  })

  router.all([
    '/men-acwy-vaccination/:campaignId/',
    '/men-acwy-vaccination/:campaignId/:nhsNumber',
    '/men-acwy-vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res, next) => {
    res.locals.type = 'MenACWY'
    res.locals.dataLocation = 'men-acwy-vaccination'
    res.locals.isMenACWY = true
    next()
  })

  router.all([
    '/vaccination/:campaignId/',
    '/vaccination/:campaignId/:nhsNumber',
    '/vaccination/:campaignId/:nhsNumber/:view',
    '/3-in-1-vaccination/:campaignId/',
    '/3-in-1-vaccination/:campaignId/:nhsNumber',
    '/3-in-1-vaccination/:campaignId/:nhsNumber/:view',
    '/men-acwy-vaccination/:campaignId/',
    '/men-acwy-vaccination/:campaignId/:nhsNumber',
    '/men-acwy-vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res, next) => {
    const data = req.session.data
    const campaign = data.campaigns[req.params.campaignId]

    res.locals.campaign = campaign
    res.locals.child = campaign.children.find(c => c.nhsNumber === req.params.nhsNumber)
    res.locals.paths = vaccination(req)
    next()
  })

  router.all([
    '/vaccination/:campaignId/',
    '/vaccination/:campaignId/:nhsNumber',
    '/vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res, next) => {
    res.locals.type = res.locals.campaign.type
    res.locals.dataLocation = 'vaccination'
    res.locals.vaccinationRecord = _.get(req.session.data, `vaccination.${req.params.campaignId}.${req.params.nhsNumber}`)
    next()
  })

  router.all([
    '/vaccination/:campaignId/:nhsNumber/which-batch'
  ], (req, res, next) => {
    const campaignType = res.locals.campaign.type
    const batchesForCampaign = Object
      .values(req.session.data.vaccines.batches)
      .filter(b => b.vaccine === campaignType)

    res.locals.batchItems = batchesForCampaign.map(v => v.name)
    next()
  })

  router.all([
    '/vaccination/:campaignId/:nhsNumber/which-batch'
  ], (req, res, next) => {
    const body = req.body

    // Set today's default batch
    // Look at all `todays-batch-` fields and find the first one that has a value
    const todaysBatch = Object
      .keys(body)
      .filter(k => k.startsWith('todays-batch'))
      .map(k => body[k])
      .filter(v => Array.isArray(v) && v.length > 0)
      .flat()

    if (todaysBatch.length > 0) {
      req.session.data['todays-batch'] = todaysBatch[0]
    }

    next()
  })

  router.all([
    '/vaccination/:campaignId/:nhsNumber/details'
  ], (req, res, next) => {
    res.locals['3in1VaccinationRecord'] = _.get(req.session.data, `3-in-1-vaccination.${req.params.campaignId}.${req.params.nhsNumber}`)
    res.locals.menACWYVaccinationRecord = _.get(req.session.data, `men-acwy-vaccination.${req.params.campaignId}.${req.params.nhsNumber}`)
    res.locals.vaccinationRecord = _.get(req.session.data, `vaccination.${req.params.campaignId}.${req.params.nhsNumber}`)

    if (!res.locals.vaccinationRecord.batch) {
      res.locals.vaccinationRecord.batch = req.session.data['todays-batch']
    }

    next()
  })

  router.get([
    '/vaccination/:campaignId/:nhsNumber',
    '/3-in-1-vaccination/:campaignId/:nhsNumber',
    '/men-acwy-vaccination/:campaignId/:nhsNumber'
  ], (req, res) => {
    res.render('vaccination/index')
  })

  router.get([
    '/vaccination/:campaignId/:nhsNumber/:view',
    '/3-in-1-vaccination/:campaignId/:nhsNumber/:view',
    '/men-acwy-vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res) => {
    res.render(`vaccination/${req.params.view}`)
  })

  router.post([
    '/vaccination/:campaignId/:nhsNumber/details'
  ], (req, res, next) => {
    const { child, vaccinationRecord } = res.locals
    let { batch, given, notes } = vaccinationRecord
    given = given !== 'No'

    if (given) {
      child.actionTaken = ACTION_TAKEN.VACCINATED
      child.outcome = 'Vaccinated'
      child.batch = batch
      child.seen = { text: 'Vaccinated', given, notes }
    } else {
      child.actionTaken = ACTION_TAKEN.COULD_NOT_VACCINATE
      child.outcome = 'Could not vaccinate'
      child.seen = { text: 'Vaccine not given', given, notes }
    }

    res.locals.child.seen.isOffline = res.locals.isOffline
    next()
  })

  router.post([
    '/vaccination/:campaignId/:nhsNumber',
    '/vaccination/:campaignId/:nhsNumber/:view',
    '/3-in-1-vaccination/:campaignId/:nhsNumber',
    '/3-in-1-vaccination/:campaignId/:nhsNumber/:view',
    '/men-acwy-vaccination/:campaignId/:nhsNumber',
    '/men-acwy-vaccination/:campaignId/:nhsNumber/:view'
  ], (req, res) => {
    res.redirect(res.locals.paths.next)
  })
}

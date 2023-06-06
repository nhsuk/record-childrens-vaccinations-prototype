import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'
faker.locale = 'en_GB'

const getBatches = () => {
  const batches = {}
  const count = faker.datatype.number({ min: 2, max: 5 })
  const prefix = faker.random.alpha({ casing: 'upper', count: 2 })

  for (let i = 0; i < count; i++) {
    const name = `${prefix}${faker.phone.number('####')}`
    const daysUntilExpiry = faker.datatype.number({ min: 10, max: 50 })
    const expiry = DateTime.now().plus({ days: daysUntilExpiry }).toISODate()
    const day = expiry.split('-')[2]
    const month = expiry.split('-')[1]
    const year = expiry.split('-')[0]
    batches[name] = { name, expiry: { year, month, day } }
  }

  return batches
}

const summarise = (v) => {
  const brand = v.method === 'Nasal spray' ? v.brand + ' nasal spray' : v.brand
  v.summary = `${v.vaccine} (${brand})`
}

export default (type) => {
  // https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1107978/Influenza-green-book-chapter19-16September22.pdf
  const fluVaccines = [
    {
      vaccine: 'Flu',
      brand: 'Fluenz Tetra',
      method: 'Nasal spray',
      isNasal: true,
      isFlu: true,
      batches: getBatches(faker)
    },
    {
      vaccine: 'Flu',
      brand: 'Fluarix Tetra',
      method: 'Injection',
      isFlu: true,
      batches: getBatches(faker)
    }
  ]
  // Possible others: Gardasil, Cervarix
  // https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1065283/HPV-greenbook-chapter-18a.pdf
  const hpvVaccines = [
    {
      vaccine: 'HPV',
      brand: 'Gardasil 9',
      method: 'Injection',
      isHPV: true,
      batches: getBatches(faker)
    }
  ]

  // Possible others: Pediacel, Repevax, Infanrix IPV
  // https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/147952/Green-Book-Chapter-15.pdf
  const dptVaccines = [
    {
      vaccine: '3-in-1',
      brand: 'Revaxis',
      method: 'Injection',
      is3in1: true,
      batches: getBatches(faker)
    }
  ]

  // Menveo, Nimenrix and MenQuadfi
  // https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1076053/Meningococcal-greenbook-chapter-22_17May2022.pdf
  const menAcwyVaccines = [
    {
      vaccine: 'MenACWY',
      brand: 'Nimenrix',
      method: 'Injection',
      isMenACWY: true,
      batches: getBatches(faker)
    }
  ]

  let vacs
  switch (type) {
    case 'Flu':
      vacs = fluVaccines
      break
    case 'HPV':
      vacs = hpvVaccines
      break
    case '3-in-1 and MenACWY':
      vacs = dptVaccines.concat(menAcwyVaccines)
      break
    default:
      // concatenate all types
      vacs = fluVaccines.concat(hpvVaccines, dptVaccines, menAcwyVaccines)
  }

  vacs.forEach(vaccine => {
    vaccine.type = type
    summarise(vaccine)
  })

  const allBatches = {}

  vacs.flatMap(v => v.batches).forEach(batches => {
    Object.keys(batches).forEach(name => {
      const batch = {
        ...batches[name],
        ...vacs.find(v => v.batches[name])
      }

      batch.summary = batch.summary.replace(')', `, ${name})`)

      delete batch.batches
      allBatches[name] = batch
    })
  })

  return { batches: allBatches, brands: vacs }
}

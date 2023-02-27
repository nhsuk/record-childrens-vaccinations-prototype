import fs from 'fs'

export const gp = (faker) => {
  const gpSurgeries = fs.readFileSync('app/generators/data/gp-surgeries.txt')
    .toString()
    .split('\n')
    .filter(e => String(e).trim())

  return faker.helpers.arrayElement(gpSurgeries)
}

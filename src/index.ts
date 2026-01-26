import { BirthNumber } from './birth_number.js'

export { BirthNumber } from './birth_number.js'

export function parseBirthNumber(value: string) {
  return new BirthNumber(value)
}

# Slovak/Czech Birth Number Validator

A TypeScript library for parsing, validating, and extracting information from Slovak and Czech birth numbers (rodné číslo). Birth numbers are unique personal identifiers used in Slovakia and the Czech Republic that encode date of birth, gender, and other demographic information.

Inspired by [rodnecislo](https://github.com/kub1x/rodnecislo/tree/master).

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript">
  <a href="https://www.npmjs.com/package/@outloud/birth-number"><img src="https://badgen.net/npm/v/@outloud/birth-number/latest" alt="Version"></a>
  <a href="https://npmcharts.com/compare/@outloud/birth-number?minimal=true"><img src="https://badgen.net/npm/dm/@outloud/birth-number" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@outloud/birth-number"><img src="https://img.shields.io/npm/l/@outloud/birth-number.svg?sanitize=true" alt="License"></a>
</p>

## Installation
```bash
npm install @outloud/birth-number
```

## Usage

```typescript
import { BirthNumber, parseBirthNumber } from '@outloud/birth-number'

// Using the class constructor
new BirthNumber('990101/1234')

// Or using the helper function
parseBirthNumber('990101/1234')
```

### Validation

```typescript
const birthNumber = parseBirthNumber('990101/1234')

// Check if the birth number is valid (format, checksum, and valid date)
console.log(birthNumber.isValid) // true or false

// Check if the format is possible (less strict, only format check)
console.log(birthNumber.isPossible) // true or false
```

### Extracting Information

```typescript
const birthNumber = parseBirthNumber('990101/1234')

// Get birth date as a Date object
console.log(birthNumber.birthDate) // Date object or null

// Get age (calculated from current date)
console.log(birthNumber.age) // number

// Check if person is an adult (18+ by default)
console.log(birthNumber.isAdult) // true or false
```

### Gender Detection

```typescript
const bn = parseBirthNumber('990101/1234')

// Get gender
console.log(bn.gender) // 'male' or 'female'

// Check specific gender
console.log(bn.isMale) // true or false
console.log(bn.isFemale) // true or false
```

### Foreign Birth Numbers

Birth numbers assigned to foreigners have a different month encoding (month + 20 or month + 70 for women).

```typescript
const bn = parseBirthNumber('992101/1234')

// Check if it's a foreign birth number
console.log(bn.isForeign) // true or false
```

### Format Support

The library supports both formats:
- **Short format** (9 digits): `YYMMDD/XXX` - used until December 31, 1953
- **Long format** (10 digits): `YYMMDD/XXXX` - used since January 1, 1954

```typescript
// Without slash separator
parseBirthNumber('9901011234')

// With slash separator
parseBirthNumber('990101/1234')

// Short format (9 digits)
parseBirthNumber('530101/123')
```

### Complete Example

```typescript
import { parseBirthNumber } from '@outloud/birth-number'

const bn = parseBirthNumber('755101/1234')

if (bn.isValid) {
  console.log(`Gender: ${bn.gender}`)
  console.log(`Birth Date: ${bn.birthDate?.toLocaleDateString()}`)
  console.log(`Age: ${bn.age}`)
  console.log(`Is Adult: ${bn.isAdult}`)
  console.log(`Is Foreign: ${bn.isForeign}`)
} else {
  console.log('Invalid birth number')
}
```


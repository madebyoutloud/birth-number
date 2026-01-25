const Constants = {
  regex: /^(\d\d)(\d\d)(\d\d)\/?(\d\d\d\d?)$/,
  serialNumberLength: 4,
  modulo: 11,
  moduleResult: 0,
  moduleExceptionValue: 10,
  moduleExceptionCheck: 0,
  ageWhenBorn: 0,
  adulthood: 18,
  monthOffset: 1,
  womanMonthAddition: 50,
  foreignMonthAddition: 20,
}

enum Components {
  year = 1,
  month = 2,
  date = 3,
  serialNumber = 4,
}

enum Gender {
  male = 'male',
  female = 'female',
}

export class BirthNumber {
  private $gender?: Gender
  private $isForeign = false
  private isLongFormat = false
  private error?: string
  private components?: Record<keyof typeof Components, string>

  private $birthDate?: Record<'year' | 'month' | 'date', number>

  constructor(value: string) {
    this.parse(value)
  }

  get gender() {
    return this.$gender
  }

  get isValid() {
    return !this.error && this.age >= Constants.ageWhenBorn
  }

  get isMale() {
    return this.$gender === Gender.male
  }

  get isFemale() {
    return this.$gender === Gender.female
  }

  get isForeign() {
    return this.$isForeign
  }

  get isPossible() {
    return !this.error
  }

  get birthDate() {
    if (!this.$birthDate) {
      return null
    }

    return new Date(this.$birthDate.year, this.$birthDate.month, this.$birthDate.date)
  }

  isAdult(adulthood = Constants.adulthood) {
    return this.age >= adulthood
  }

  get age() {
    if (!this.$birthDate) {
      return 0
    }

    // Current date parsed (ignoring +1 timezone)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()

    let age = year - this.$birthDate.year

    if (month > this.$birthDate.month) {
      return age
    }

    if (month < this.$birthDate.month) {
      return --age
    }

    // In Czechia you reach certain age at the beginning of your birthday.
    return (date >= this.$birthDate.date) ? age : --age
  }

  private parse(value: string) {
    const match = Constants.regex.exec(value)

    if (!match) {
      this.error = 'Input string does not match the pattern'
      return false
    }

    this.components = {
      year: match[Components.year]!,
      month: match[Components.month]!,
      date: match[Components.date]!,
      serialNumber: match[Components.serialNumber]!,
    }

    this.isLongFormat = this.components.serialNumber.length === Constants.serialNumberLength

    if (this.isLongFormat) {
      const birthNumber = value.replace('/', '')

      const numberValue = Number(birthNumber)
      const test = Number(this.components.serialNumber.slice(0, -1))
      const check = Number(this.components.serialNumber.slice(-1))

      if (numberValue % Constants.modulo === Constants.moduleResult) {
      // ok
      } else if (test % Constants.modulo === Constants.moduleExceptionValue &&
        check === Constants.moduleExceptionCheck
      ) {
      // the rare 1000 cases
      } else {
        this.error = 'Failed the modulo check'
        return false
      }
    }

    return this.parseBirthDate()
  }

  private parseBirthDate() {
    let year = Number(this.components!.year)

    if (!this.isLongFormat && year <= 53) {
      // until 31.12.1953
      year += 1900
    } else if (this.isLongFormat && year > 53) {
      // 1.1.1954 - 31.12.1999
      year += 1900
    } else if (this.isLongFormat && year <= 53) {
      // 1.1.2000 - 31.12.2053
      year += 2000
    } else {
      // This never happened as it would be the same as for 1954-2000
      // since 1.1.2054
      this.error = 'Invalid birth year'
      return false
    }

    let month = Number(this.components!.month)

    // Women have month + 50
    if (month > Constants.womanMonthAddition) {
      month -= Constants.womanMonthAddition
      this.$gender = Gender.female
    }

    // Sometimes men/women get extra month + 20
    if (month > Constants.foreignMonthAddition) {
      month -= Constants.foreignMonthAddition
      this.$isForeign = true
    }

    // Ok
    month -= Constants.monthOffset

    const date = Number(this.components!.date)

    this.$birthDate = { year, month, date }

    return this.validateBirthDate()
  }

  private validateBirthDate() {
    const { year, month, date } = this.$birthDate!
    const birthDate = this.birthDate!
    const convertedDate = `${birthDate.getFullYear()}-${birthDate.getMonth()}-${birthDate.getDate()}`
    const givenDate = `${year}-${month}-${date}`

    if (givenDate !== convertedDate) {
      this.error = 'Invalid birth date'
      return false
    }

    return true
  }
}

// const DATE_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/
const NUMBER_REGEX = /^\d+$/

const isNumericString = (data: string): boolean => {
  return NUMBER_REGEX.test(data)
}

export const assertValidUserId = (userId: string): void => {
  if (!isNumericString(userId)) {
    throw new TypeError(`Invalid userId ('${userId}'). Expected numbers only.`)
  }
}

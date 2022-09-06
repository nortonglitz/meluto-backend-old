export const randomString = (length: number) => {
  let generatedString = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    generatedString += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return generatedString
}

export const randomNumber = (length: number) => {
  let generatedNumber = ''
  const numbers = '0123456789'

  for (let i = 0; i < length; i++) {
    generatedNumber += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  return generatedNumber
}

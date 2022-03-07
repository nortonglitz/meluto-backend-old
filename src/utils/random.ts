export const randomString = (length: number) => {
  let generatedString = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    generatedString += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return generatedString
}

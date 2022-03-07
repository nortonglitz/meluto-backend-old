import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js'

const deviceDetector = new DeviceDetector()

export const parseUserAgent = async (userAgent: string) => {
  return new Promise<DeviceDetectorResult>((resolve, reject) => {
    const device = deviceDetector.parse(userAgent)
    const { bot } = device
    if (!device) {
      const e = new Error('fail to parse user agent')
      e.name = 'UserAgentParseError'
      reject(e)
    }
    if (bot) {
      const e = new Error('Bot detected')
      e.name = 'BotError'
      reject(e)
    }
    resolve(device)
  })
}

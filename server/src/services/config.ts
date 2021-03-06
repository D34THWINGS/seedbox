import path from 'path'
import { config as loadConfig } from 'dotenv'

const configKeys = [
  'PORT',
  'MONGO_URL',
  'COOKIE_NAME',
  'COOKIE_SECRET',
  'COOKIE_DAYS_TTL',
  'USE_SECURE_COOKIES',
  'JWT_SECRET',
  'UPLOAD_LIMIT',
  'DOWNLOAD_SUBSCRIPTION_THROTTLE',
  'DOWNLOAD_FOLDER',
] as const

export type Config = { [K in typeof configKeys[number]]: string }

export const makeConfig = () => {
  const { error, parsed } = loadConfig({ path: path.join(process.cwd(), '.env') })

  if (error || !parsed) {
    throw new Error('Server configuration not found')
  }

  configKeys.forEach((key) => {
    if (parsed[key] === undefined) {
      throw new Error(`Missing configuration key: "${key}"`)
    }
  })

  return parsed as Config
}

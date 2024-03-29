import { Logger } from './logger.interface'
import { createPinoLogger } from './pinoLogger'
import { createSilentLogger } from './silentLogger'

let createLogger: (string?) => Logger

const verboseTestLogs = false

if (!verboseTestLogs && process.env.NODE_ENV === 'test') {
  createLogger = createSilentLogger
} else {
  createLogger = createPinoLogger
}

export { createLogger }

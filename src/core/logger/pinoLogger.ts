import { pino as pinoLogger } from 'pino'
import { Logger } from './logger.interface'

const parentLogger = pinoLogger({
  level: 'debug',
  messageKey: 'message',
  errorKey: 'error'
})

export const createPinoLogger = (moduleName): Logger => {
  return parentLogger.child({ module: moduleName })
}

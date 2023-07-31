import { pino as pinoLogger } from 'pino'
import { Logger } from './logger.interface'

const parentLogger = pinoLogger({
  level: 'debug', /* minimum logging level */

  messageKey: 'message',

  /* 'err' will avoid conflicts with 'error';
   * the typical error object is expected to have type, stack and message;
   * log.error({ error: e }, 'message') will have an empty error object;
   * the correct full-error log: log.error(e, 'optional message');
   * the log will have 'err' property with the full object correctly transformed by pino.
   */
  errorKey: 'err'
})

export const createPinoLogger = (moduleName): Logger => {
  return parentLogger.child({ module: moduleName })
}

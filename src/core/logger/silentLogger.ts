import { Logger } from './logger.interface'

export const createSilentLogger = (/* moduleName */): Logger => {
  return {
    debug: function (): void { return undefined },
    info: function (): void { return undefined },
    warn: function (): void { return undefined },
    error: function (): void { return undefined }
  }
}

import { Logger } from './logger.interface'

export const createConsoleLogger = (moduleName): Logger => {
  return {
    debug: function (params: Record<string, any> | string, message?: string | undefined): void {
      // eslint-disable-next-line no-console
      console.log({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    info: function (params: Record<string, any> | string, message?: string | undefined): void {
      // eslint-disable-next-line no-console
      console.info({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    warn: function (params: Record<string, any> | string, message?: string | undefined): void {
      // eslint-disable-next-line no-console
      console.warn({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    error: function (params: Record<string, any> | string, message?: string | undefined): void {
      // eslint-disable-next-line no-console
      console.error({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    }
  }
}

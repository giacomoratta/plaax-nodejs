type loggerFunction = (params: Record<string, any> | string, message?: string | undefined) => void

interface Logger {
  debug: loggerFunction
  info: loggerFunction
  warn: loggerFunction
  error: loggerFunction
}

export const createLogger = (moduleName): Logger => {
  return {
    debug: function (params: Record<string, any> | string, message?: string | undefined): void {
      console.log({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    info: function (params: Record<string, any> | string, message?: string | undefined): void {
      console.info({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    warn: function (params: Record<string, any> | string, message?: string | undefined): void {
      console.warn({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    },

    error: function (params: Record<string, any> | string, message?: string | undefined): void {
      console.error({
        module: moduleName,
        ...(typeof params !== 'string' ? params : {})
      }, (typeof params !== 'string' ? message : params))
    }
  }
}

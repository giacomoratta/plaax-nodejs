type loggerFunction = (params: Record<string, any> | string, message?: string | undefined) => void

interface Logger {
  debug: loggerFunction
  info: loggerFunction
  warn: loggerFunction
  error: loggerFunction
}

const createLoggerTests = (moduleName): Logger => {
  return {
    debug: function (): void { return undefined },
    info: function (): void { return undefined },
    warn: function (): void { return undefined },
    error: function (): void { return undefined }
  }
}

let createLogger = (moduleName): Logger => {
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

if (process.env.NODE_ENV === 'test') {
  createLogger = createLoggerTests
}

export { createLogger }

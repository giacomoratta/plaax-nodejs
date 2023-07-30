type loggerFunction = (params: Record<string, any> | string, message?: string | undefined) => void

export interface Logger {
  debug: loggerFunction
  info: loggerFunction
  warn: loggerFunction
  error: loggerFunction
}

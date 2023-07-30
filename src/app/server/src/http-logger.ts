import koaPinoLogger from 'koa-pino-logger'

let httpLogger = koaPinoLogger()

const httpLoggerSilent = async (ctx, next): Promise<void> => {
  await next()
}

if (process.env.NODE_ENV === 'test') {
  httpLogger = httpLoggerSilent
}

export { httpLogger }

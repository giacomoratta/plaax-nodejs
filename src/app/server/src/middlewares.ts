import { genericJsonServerError } from './api/serverResponseBuilders'
import { createLogger } from '../../../core/logger'

const log = createLogger('middlewares')

export const stateMiddleware = async (ctx, next): Promise<void> => {
  ctx.state.gateways = {}
  ctx.state.services = {}
  await next()
}

export const genericErrorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    log.error({ error }, `Unhandled error on server: ${error.message}`)
    return genericJsonServerError(ctx, error)
  }
}

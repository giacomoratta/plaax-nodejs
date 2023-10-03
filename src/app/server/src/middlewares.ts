import { genericJsonServerError } from './api/serverResponseBuilders'

export const stateMiddleware = async (ctx, next): Promise<void> => {
  ctx.state.gateways = {}
  ctx.state.services = {}
  await next()
}

export const genericErrorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    return genericJsonServerError(ctx, error)
  }
}

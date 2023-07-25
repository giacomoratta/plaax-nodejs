import { type LambdaHandler, type LambdaApiRoutesHandlerMap } from './types'
import { routesHandlerMap } from './apiRoutesHandler'
import { genericJsonServerError } from './responseBuilders'

import { createLogger } from '../../logger'
const log = createLogger('awsLambda/api/index')

export const setupLambdaApiHandler = (handlersMap: LambdaApiRoutesHandlerMap): LambdaHandler => {
  return async (event, context) => {
    log.debug({ event, context }, 'Event received by api lambda')

    try {
      if (handlersMap[event.routeKey] === undefined) {
        return genericJsonServerError({
          reason: 'No handler found for this route: ' + event.routeKey
        })
      }

      if (!handlersMap[event.routeKey].enabled) {
        return genericJsonServerError({
          reason: 'Handler disabled for this route: ' + event.routeKey
        })
      }

      return await handlersMap[event.routeKey].fn(event, context)
    } catch (error) {
      log.error({ error }, 'API Lambda error.')
      return genericJsonServerError({
        reason: 'Unexpected error!'
      })
    }
  }
}

export default setupLambdaApiHandler(routesHandlerMap)

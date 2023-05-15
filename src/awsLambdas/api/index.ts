import {
  LambdaHandler,
  InternalLambdaHandlersMap
} from './types'
import {
  buildJsonResponse,
  genericJsonServerError,
  notFoundJsonServerError
} from './responseBuilders'
import { createLogger } from '../../logger'

import { getBoard } from '../../apiControllers/getBoard'

const log = createLogger('awsLambda/api/index')

const handlersMap: InternalLambdaHandlersMap = {
  'GET /board/user/{userId}': {
    enabled: true,
    fn: async (event) => {
      const userId = (event.pathParameters?.userId ?? '')
      const data = await getBoard(userId)
      if (data == null) {
        return notFoundJsonServerError('Board not found for user ' + userId)
      }
      return buildJsonResponse(200, {
        message: 'Board for user ' + userId,
        payload: data
      })
    }
  }
  // 'GET /calendar/user/{userId}': { enabled: true, fn: () }
  // 'GET /user/{userId}/projects': { enabled: true, fn: () }
  // 'POST /item': { enabled: true, fn: () }
}

export const handler: LambdaHandler =
  async (event, context) => {
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

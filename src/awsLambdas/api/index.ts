import {
  LambdaHandler,
  InternalLambdaHandlersMap
} from './types'

import { getFullProject } from '../../apiControllers/getFullProject'

import { genericJsonServerError } from './responseBuilders'
import { createLogger } from '../../logger'

const log = createLogger('awsLambda/api/index')

const handlersMap: InternalLambdaHandlersMap = {
  'GET /project/{projectId}': {
    enabled: true,
    fn: async (event) => {
      log.debug('Call from apiControllers!')
      await getFullProject(event.pathParameters?.projectId)
      // event.pathParameters['projectId']
      // return Controller(): LambdaApiResponse
      return genericJsonServerError({
        reason: 'No handler found for route: ' + event.routeKey
      })
    }
  }
  // 'GET /user/{userId}/projects': { enabled: true, fn: () }
  // 'GET /user/{userId}/calendar': { enabled: true, fn: () }
  // ''POST /item'': { enabled: true, fn: () }
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

/*
Implementation
- call specific handler
  - validate path params (validators)
  - validate query params (validators)
  - use models
  - ?? DO NOT follow the structure board-calendar: keep everything smaller and separate?
  - do the logic

- (done) Use types:
  https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/trigger/api-gateway-proxy.d.ts

(done) Pre-requisites
- (done) check routeKey (method + path)
- (done) check request: method (no path params, query params - inside the controller logic, below)
- (done) uniform responses
    {
      statusCode,
      body: JSON.stringify({ message, payload }),
      headers: {
        'Content-Type': CONTENT_TYPE_JSON
      },
      isBase64Encoded: false
    }
- (done) log full event
*/

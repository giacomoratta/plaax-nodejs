import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context as LambdaContext,
  APIGatewayProxyStructuredResultV2
} from 'aws-lambda'

import { getFullProject } from '../../apiControllers/getFullProject'

import { genericJsonServerError } from './responseBuilders'
import { createLogger } from '../../logger'

const log = createLogger('awsLambda/api/index')

export const handler: APIGatewayProxyHandlerV2 =
  async (event: APIGatewayProxyEventV2, context: LambdaContext): Promise<APIGatewayProxyStructuredResultV2> => {
    log.debug({ event, context }, 'Event received by api lambda')

    try {
      switch (event.routeKey) {
        case 'GET /project/{projectId}': return await getProjectHandler(event)

        case 'GET /user/{userId}/projects':
          log.debug('Call from apiControllers!')
          // event.pathParameters['projectId']
          // return Controller(): LambdaApiResponse
          break

        case 'GET /user/{userId}/calendar':
          // ?beginTs=123&endTs=456 - change names
          log.debug('Call from apiControllers!')
          // event.pathParameters['projectId']
          // return Controller(): LambdaApiResponse
          break

        case 'POST /item':
          log.debug('Call from apiControllers!')
          // event.pathParameters['projectId']
          // return Controller(): LambdaApiResponse
          break
      }

      return genericJsonServerError({
        reason: 'No handler found for route: ' + event.routeKey
      })
    } catch (error) {
      log.error({ error }, 'API Lambda error.')
      return genericJsonServerError({
        reason: 'No handler found for route: ' + event.routeKey
      })
    }
  }

const getProjectHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
  log.debug('Call from apiControllers!')
  await getFullProject(event.pathParameters?.projectId)
  // event.pathParameters['projectId']
  // return Controller(): LambdaApiResponse
  return genericJsonServerError({
    reason: 'No handler found for route: ' + event.routeKey
  })
}

/*
Implementation
- call specific handler
  - validate path params (validators)
  - validate query params (validators)
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

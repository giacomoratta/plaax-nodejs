import { ApiGatewayEvent } from './apiGateway.event.interface'
// todo: import { ApiGatewayContext } from './apiGateway.context.interface'

import { LambdaApiResponse, genericJsonServerError } from './responseBuilders'

import { createLogger } from '../../logger'

const log = createLogger('awsLambda/api/index')

export const handler = async (event: ApiGatewayEvent, context: Record<string, any>): Promise<LambdaApiResponse> => {
  log.debug({ event }, 'Event received by api lambda')
  log.debug({ context }, 'Context received by api lambda')

  switch (event.routeKey) {
    case 'GET /project/{projectId}':
      log.debug('Call from apiControllers!')
      // event.pathParameters['projectId']
      // return Controller(): LambdaApiResponse
      break
  }

  return genericJsonServerError({
    reason: 'Match not found for route key: ' + event.routeKey
  })
}

/*
Pre-requisites
- check request: method, path params, query params
- validate params (validators)
- uniform responses
    {
      statusCode,
      body: JSON.stringify({ message, payload }),
      headers: {
        'Content-Type': CONTENT_TYPE_JSON
      },
      isBase64Encoded: false
    }
- log full event

Implementation
- check routeKey (method + path)
- call specific handler
  - validate params
  - do the logic
*/

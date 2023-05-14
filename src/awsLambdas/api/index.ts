import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
  Context as LambdaContext,
  APIGatewayProxyStructuredResultV2
} from 'aws-lambda'

import { genericJsonServerError } from './responseBuilders'
import { createLogger } from '../../logger'

const log = createLogger('awsLambda/api/index')

export const handler: APIGatewayProxyHandlerV2 =
  async (event: APIGatewayProxyEventV2, context: LambdaContext): Promise<APIGatewayProxyStructuredResultV2> => {
    log.debug({ event, context }, 'Event received by api lambda')

    switch (event.routeKey) {
      case 'GET /project/{projectId}':
        log.debug('Call from apiControllers!')
        // event.pathParameters['projectId']
        // return Controller(): LambdaApiResponse
        break
    }

    return genericJsonServerError({
      reason: 'No handler found for route: ' + event.routeKey
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

Use types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/trigger/api-gateway-proxy.d.ts
*/

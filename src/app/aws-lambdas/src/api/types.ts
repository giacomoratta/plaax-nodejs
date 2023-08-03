/* This file exports all the types used by any Lambda which handles an API request.
 * Ideally, this should be the only file which import types from @types/aws-lambda for a better maintenance.
 */

import {
  type APIGatewayProxyEventV2,
  type Context as LambdaContext,
  type APIGatewayProxyStructuredResultV2
} from 'aws-lambda'

export type LambdaHandler =
  (event: APIGatewayProxyEventV2, context: LambdaContext) => Promise<APIGatewayProxyStructuredResultV2>

export type LambdaResponse = APIGatewayProxyStructuredResultV2

export type InternalLambdaEventHandler =
  (event: APIGatewayProxyEventV2, context?: LambdaContext) => Promise<APIGatewayProxyStructuredResultV2>

export type LambdaApiRoutesHandlerMap = Record<string, {
  enabled: boolean
  fn: InternalLambdaEventHandler
}>

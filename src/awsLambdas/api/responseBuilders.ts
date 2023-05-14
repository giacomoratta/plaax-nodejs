import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { assertHttpStatusCodeIsValid, HttpStatusCode } from '../../shared/httpStatusCode'
import { FileMimeTypes } from '../../shared/fileMimeType'

type ResponsePayload = Record<string, any>

export const buildJsonResponse = (statusCode: HttpStatusCode, responseData: {
  message: string
  payload: ResponsePayload
}): APIGatewayProxyStructuredResultV2 => {
  assertHttpStatusCodeIsValid(statusCode)
  return {
    statusCode,
    body: JSON.stringify(responseData),
    headers: {
      'Content-Type': FileMimeTypes['.json']
    },
    isBase64Encoded: false
  }
}

export const genericJsonServerError = (errorData: ResponsePayload): APIGatewayProxyStructuredResultV2 =>
  buildJsonResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
    message: 'Internal server error.',
    payload: errorData
  })

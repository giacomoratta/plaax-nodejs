import { assertHttpStatusCodeIsValid, HttpStatusCode } from '../../shared/httpStatusCode'
import { FileMimeTypes } from '../../shared/fileMimeType'

type ResponsePayload = Record<string, any>

export interface LambdaApiResponse {
  statusCode: HttpStatusCode
  body: string
  headers?: {
    'Content-Type': FileMimeTypes
  }
  isBase64Encoded: boolean
}

export const buildJsonResponse = (statusCode: HttpStatusCode, responseData: {
  message: string
  payload: ResponsePayload
}): LambdaApiResponse => {
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

export const genericJsonServerError = (errorData: ResponsePayload): LambdaApiResponse =>
  buildJsonResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
    message: 'Internal server error.',
    payload: errorData
  })

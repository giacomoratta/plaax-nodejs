import { type LambdaResponse } from './types'
import { assertHttpStatusCodeIsValid, HttpStatusCode } from '../../../../core/shared/httpStatusCode'
import { FileMimeTypes } from '../../../../core/shared/fileMimeType'

type ResponsePayload = Record<string, any>

export const buildJsonResponse = (statusCode: HttpStatusCode, responseData: {
  message: string
  payload: ResponsePayload
}): LambdaResponse => {
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

export const notFoundJsonServerError = (message: string): LambdaResponse =>
  buildJsonResponse(HttpStatusCode.NOT_FOUND, {
    message,
    payload: {}
  })

export const genericJsonServerError = (errorData: ResponsePayload): LambdaResponse =>
  buildJsonResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
    message: 'Internal server error.',
    payload: errorData
  })
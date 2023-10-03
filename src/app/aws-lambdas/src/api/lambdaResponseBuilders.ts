import { type LambdaResponse } from './types'
import { ApiResponse, genericErrorResponse } from '../../../../core/apiControllers/apiResponseBuilders'
import { FileMimeTypes } from '../../../../core/shared/fileMimeType'

export const toLambdaApiResponse = (apiResponse: ApiResponse): LambdaResponse => {
  return {
    statusCode: apiResponse.code,
    body: JSON.stringify({
      message: apiResponse.message,
      payload: apiResponse.payload,
      error: apiResponse.error
    }),
    headers: {
      'Content-Type': FileMimeTypes['.json']
    },
    isBase64Encoded: false
  }
}

export const genericJsonServerError = (errorData): LambdaResponse => {
  return toLambdaApiResponse(genericErrorResponse(errorData))
}

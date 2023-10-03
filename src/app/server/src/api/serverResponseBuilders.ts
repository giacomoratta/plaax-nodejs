import { ApiResponse, genericErrorResponse } from '../../../../core/apiControllers/apiResponseBuilders'
import { FileMimeTypes } from '../../../../core/shared/fileMimeType'

export const toServerApiResponseContext = (ctx, apiResponse: ApiResponse): void => {
  ctx.status = apiResponse.code
  ctx.body = {
    message: apiResponse.message,
    payload: apiResponse.payload,
    error: apiResponse.error
  }
  ctx.set('Content-Type', FileMimeTypes['.json'])
}

export const genericJsonServerError = (ctx, errorData): void => {
  return toServerApiResponseContext(ctx, genericErrorResponse(errorData))
}

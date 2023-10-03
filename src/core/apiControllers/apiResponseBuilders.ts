import { HttpStatusCode } from '../shared/httpStatusCode'
import { HttpHeaders } from '../shared/httpHeaders'

type ResponsePayload = Record<string, any>

export interface ApiResponse {
  code: HttpStatusCode
  message: string
  payload?: ResponsePayload
  error?: ResponsePayload
  headers?: HttpHeaders
}

export const successResponse = (message: string, payload?: ResponsePayload): ApiResponse => ({
  code: HttpStatusCode.OK,
  message,
  payload
})

export const dataNotFoundResponse = (message: string): ApiResponse => ({
  code: HttpStatusCode.NOT_FOUND,
  message
})

export const genericErrorResponse = (errorData: ResponsePayload | Error): ApiResponse => {
  const errorResponse: ApiResponse = {
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error.'
  }
  if (errorData instanceof Error) {
    errorResponse.error = {
      message: errorData.message
    }
  } else {
    errorResponse.error = errorData
  }
  return errorResponse
}

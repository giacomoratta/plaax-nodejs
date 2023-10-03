import { type LambdaApiRoutesHandlerMap } from './types'

import { toLambdaApiResponse } from './lambdaResponseBuilders'

import * as boardApiController from '../../../../core/apiControllers/board.controller'
import * as userProjectsApiController from '../../../../core/apiControllers/userProjects.controller'

// import { createLogger } from '../../logger'
// const log = createLogger('aws-lambdas/api/routesHandler')

export const routesHandlerMap: LambdaApiRoutesHandlerMap = {
  'GET /user/{userId}/projects': {
    enabled: true,
    fn: async (event) => {
      const userId = (event.pathParameters?.userId ?? '')
      const apiResponse = await userProjectsApiController.getUserProjects(userId)
      return toLambdaApiResponse(apiResponse)
    }
  },
  'GET /board/user/{userId}': {
    enabled: true,
    fn: async (event) => {
      const userId = (event.pathParameters?.userId ?? '')
      const apiResponse = await boardApiController.getUserBoard(userId)
      return toLambdaApiResponse(apiResponse)
    }
  }
  // 'GET /calendar/user/{userId}': { enabled: true, fn: () }
  // 'POST /item': { enabled: true, fn: () }
}

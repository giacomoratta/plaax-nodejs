import { LambdaApiRoutesHandlerMap } from './types'

import {
  buildJsonResponse,
  notFoundJsonServerError
} from './responseBuilders'

import { getUserBoard } from '../../apiControllers/board.controller'
import { getUserProjects } from '../../apiControllers/userProjects.controller'

// import { createLogger } from '../../logger'
// const log = createLogger('awsLambda/api/routesHandler')

export const routesHandlerMap: LambdaApiRoutesHandlerMap = {
  'GET /user/{userId}/projects': {
    enabled: true,
    fn: async (event) => {
      const userId = (event.pathParameters?.userId ?? '')
      const data = await getUserProjects(userId)
      if (data == null) {
        return notFoundJsonServerError(`The user ${userId} is not associated to any project yet.`)
      }
      return buildJsonResponse(200, {
        message: 'Projects for the user ' + userId,
        payload: data
      })
    }
  },
  'GET /board/user/{userId}': {
    enabled: false,
    fn: async (event) => {
      const userId = (event.pathParameters?.userId ?? '')
      const data = await getUserBoard(userId)
      if (data == null) {
        return notFoundJsonServerError('Board not found for user ' + userId)
      }
      return buildJsonResponse(200, {
        message: 'Board for user ' + userId,
        payload: data
      })
    }
  }
  // 'GET /calendar/user/{userId}': { enabled: true, fn: () }
  // 'POST /item': { enabled: true, fn: () }
}

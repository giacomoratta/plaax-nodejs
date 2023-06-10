import { routesHandlerMap } from '../apiRoutesHandler'

import * as userProjectsApiController from '../../../apiControllers/userProjects.controller'
import * as boardApiController from '../../../apiControllers/board.controller'

import {
  projectItemsArrayP1001P1002
} from '../../../__tests__/__data-models__/projectItemsArray-p1001-p1002'
import { projectExpandedP1001 } from '../../../__tests__/__data-models__/projectExpanded-p1001'
import { projectExpandedP1002 } from '../../../__tests__/__data-models__/projectExpanded-p1002'

jest.mock('../../../apiControllers/userProjects.controller')
jest.mock('../../../apiControllers/board.controller')
const mockedUserProjectsApiController = userProjectsApiController as jest.Mocked<typeof userProjectsApiController>
const mockedBoardApiController = boardApiController as jest.Mocked<typeof boardApiController>

describe('AWS Lambda handler for API Gateway', () => {
  describe('Tests for path "GET /user/{userId}/projects"', () => {
    const routeTestKey = 'GET /user/{userId}/projects'
    const routeHandlerBasicEvent = {
      pathParameters: {
        userId: '1234'
      }
    }

    it('should throw if api controller throws', async () => {
      mockedUserProjectsApiController.getUserProjects.mockImplementation(async () => { throw new Error('unexpected error!') })
      await expect(async () => {
        // @ts-expect-error: incomplete parameters for route fn() - enough for testing
        return await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)
      }).rejects.toThrow('unexpected error!')
      expect(mockedUserProjectsApiController.getUserProjects).toHaveBeenCalled()
    })

    it('should return 404 if user has no projects', async () => {
      mockedUserProjectsApiController.getUserProjects.mockImplementation(async () => { return undefined })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)
      expect(routeHandlerResponse.statusCode).toBe(404)
      expect(routeHandlerResponse.body).toBe('{"message":"The user 1234 is not associated to any project yet.","payload":{}}')
    })

    it('should return 200 with user projects', async () => {
      mockedUserProjectsApiController.getUserProjects.mockImplementation(async () => {
        return projectItemsArrayP1001P1002
      })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)

      const bodyJson = JSON.parse(routeHandlerResponse.body ?? '')

      expect(routeHandlerResponse.statusCode).toBe(200)
      expect(bodyJson.payload).toMatchObject(projectItemsArrayP1001P1002)
    })
  })

  describe('Tests for path "GET /board/user/{userId}"', () => {
    const routeTestKey = 'GET /board/user/{userId}'
    const routeHandlerBasicEvent = {
      pathParameters: {
        userId: '1234'
      }
    }

    it('should throw if api controller throws', async () => {
      mockedBoardApiController.getUserBoard.mockImplementation(async () => { throw new Error('unexpected error!') })
      await expect(async () => {
        // @ts-expect-error: incomplete parameters for route fn() - enough for testing
        return await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)
      }).rejects.toThrow('unexpected error!')
      expect(mockedBoardApiController.getUserBoard).toHaveBeenCalled()
    })

    it('should return 404 if user has an empty board', async () => {
      mockedBoardApiController.getUserBoard.mockImplementation(async () => { return undefined })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)
      expect(routeHandlerResponse.statusCode).toBe(404)
      expect(routeHandlerResponse.body).toBe('{"message":"Board not found for user 1234.","payload":{}}')
    })

    it('should return 200 with user board', async () => {
      const userProjectsOnBoard = [
        projectExpandedP1001,
        projectExpandedP1002
      ]
      mockedBoardApiController.getUserBoard.mockImplementation(async () => { return userProjectsOnBoard })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn(routeHandlerBasicEvent)

      const bodyJson = JSON.parse(routeHandlerResponse.body ?? '')

      expect(routeHandlerResponse.statusCode).toBe(200)
      expect(bodyJson.payload).toMatchObject(userProjectsOnBoard)
    })
  })
})

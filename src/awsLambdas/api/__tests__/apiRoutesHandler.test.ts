import { routesHandlerMap } from '../apiRoutesHandler'
import * as userProjects from '../../../apiControllers/userProjects.controller'
import {
  projectItemsArrayP1001P1002
} from '../../../__tests__/__data-models__/projectItemsArray-p1001-p1002'

jest.mock('../../../apiControllers/userProjects.controller')
const mockedGetUserProjects = userProjects as jest.Mocked<typeof userProjects>

describe('AWS Lambda handler for API Gateway', () => {
  describe('Tests for path "GET /user/{userId}/projects"', () => {
    const routeTestKey = 'GET /user/{userId}/projects'

    it('should throw if api controller throws', async () => {
      mockedGetUserProjects.getUserProjects.mockImplementation(async () => { throw new Error('') })
      await expect(async () => {
        // @ts-expect-error: incomplete parameters for route fn() - enough for testing
        return await routesHandlerMap[routeTestKey].fn()
      }).rejects.toThrow()
    })

    it('should return 404 if user has no projects', async () => {
      mockedGetUserProjects.getUserProjects.mockImplementation(async () => { return undefined })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn({
        pathParameters: {
          userId: '1234'
        }
      })
      expect(routeHandlerResponse.statusCode).toBe(404)
      expect(routeHandlerResponse.body).toBe('{"message":"The user 1234 is not associated to any project yet.","payload":{}}')
    })

    it('should return 200 with user projects', async () => {
      mockedGetUserProjects.getUserProjects.mockImplementation(async () => {
        return projectItemsArrayP1001P1002
      })
      // @ts-expect-error: incomplete parameters for route fn() - enough for testing
      const routeHandlerResponse = await routesHandlerMap[routeTestKey].fn({
        pathParameters: {
          userId: '1234'
        }
      })

      const bodyJson = JSON.parse(routeHandlerResponse.body ?? '')

      expect(routeHandlerResponse.statusCode).toBe(200)
      expect(bodyJson.payload).toMatchObject(projectItemsArrayP1001P1002)
    })
  })
})

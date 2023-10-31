import { server, routerRestApiV1 } from '../server'
import request from 'supertest'

import * as apiHelloWorld from '../../../../core/apiControllers/helloWorld'
jest.mock('../../../../core/apiControllers/helloWorld')

const mockedApiHelloWorldById = apiHelloWorld.getById as jest.MockedFunction<typeof apiHelloWorld.getById>

describe('Test the server setup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Middleware setup', () => {
    it('should handle errors with the generic error handler', async () => {
      const testErrorMessage = 'Error from the hello world api'
      mockedApiHelloWorldById.mockImplementationOnce(async () => {
        throw new Error(testErrorMessage)
      })

      const response = await request(server.callback()).get('/rest/v1/hello/world/111')

      expect(response.body).toMatchObject({
        message: 'Internal server error.',
        error: {
          message: testErrorMessage
        }
      })
      expect(mockedApiHelloWorldById).toHaveBeenCalled()
    })

    it('should have expected properties from the middleware state', async () => {
      const sampleApiController = jest.fn()
      routerRestApiV1.get('/test-api/:id', sampleApiController)

      await request(server.callback()).get('/rest/v1/test-api/333')

      const context = sampleApiController.mock.calls[0][0]
      expect(context.state).toHaveProperty('gateways')
      expect(context.state).toHaveProperty('services')
    })
  })

  describe('Routes setup', () => {
    it('should call hello-world API with ID', async () => {
      const paramIdName = 'id'
      const paramIdValue = 'abc123'
      await request(server.callback()).get(`/rest/v1/hello/world/${paramIdValue}`)

      const context = mockedApiHelloWorldById.mock.calls[0][0]
      expect(context.params[paramIdName]).toEqual(paramIdValue)

      expect(mockedApiHelloWorldById).toHaveBeenCalled()
    })
  })
})

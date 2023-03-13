import { server, router } from '../setup'
import request from 'supertest'

import * as apiHelloWorld from '../../api/helloWorld'
jest.mock('../../api/helloWorld')

const mockedApiHelloWorldById = apiHelloWorld.getById as jest.MockedFunction<typeof apiHelloWorld.getById>

describe('Server Setup', () => {
  describe('Middleware setup', () => {
    it('should have expected properties from the middleware state', async () => {
      const sampleApiController = jest.fn()
      router.get('/test-api/:id', sampleApiController)

      await request(server.callback()).get('/rest/v1/test-api/333')

      const context = sampleApiController.mock.calls[0][0]
      expect(context.state).toHaveProperty('gateways')
      expect(context.state).toHaveProperty('services')
    })
  })

  describe('Routes setup', () => {
    it('should call hello-world API with ID', async () => {
      const paramIdName = 'id'
      const paramIdValue = 'axy123'
      await request(server.callback()).get(`/rest/v1/hello/world/${paramIdValue}`)

      const context = mockedApiHelloWorldById.mock.calls[0][0]
      expect(context.params[paramIdName]).toEqual(paramIdValue)

      expect(mockedApiHelloWorldById).toHaveBeenCalled()
    })
  })
})

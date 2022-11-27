import server from '../setup'
import request from 'supertest'

import { apiHelloWorldById } from '../../apiControllers'
jest.mock('../../apiControllers')

const mockedApiHelloWorldById = apiHelloWorldById as jest.MockedFunction<typeof apiHelloWorldById>

describe('Server setup', () => {
  it('should have some properties in the middleware state', async () => {
    await request(server.callback()).get('/rest/v1/hello/world/123')
    const context = mockedApiHelloWorldById.mock.calls[0][0]

    expect(context.state).toHaveProperty('gateways')
    expect(context.state).toHaveProperty('services')
  })
})

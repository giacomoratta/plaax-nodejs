import { setupLambdaApiHandler } from '../handler'
import { buildJsonResponse } from '../responseBuilders'

describe('AWS Lambda handler for API Gateway', () => {
  it('should return 500 if route not found, 200 if route found', async () => {
    const routeTestKey = 'GET /sample'
    const handler = setupLambdaApiHandler({
      [routeTestKey]: {
        enabled: true,
        fn: async (event) => {
          return buildJsonResponse(200, {
            message: 'Sample message',
            payload: {}
          })
        }
      }
    })

    // @ts-expect-error: incomplete parameters for handler() - enough for testing
    const getSampleRouteResponse = await handler({ routeKey: routeTestKey })
    // @ts-expect-error: incomplete parameters for handler() - enough for testing
    const unknownRouteResponse = await handler({ routeKey: 'GET /unknown' })

    expect(getSampleRouteResponse.statusCode).toBe(200)
    expect(getSampleRouteResponse.body)
      .toBe('{"message":"Sample message","payload":{}}')

    expect(unknownRouteResponse.statusCode).toBe(500)
    expect(unknownRouteResponse.body)
      .toBe('{"message":"Internal server error.","payload":{"reason":"No handler found for this route: GET /unknown"}}')
  })

  it('should return 500 if route is not enabled', async () => {
    const routeTestKey = 'GET /sample'
    const routesHandlerMap = {
      [routeTestKey]: {
        enabled: false,
        fn: jest.fn()
      }
    }
    const handler = setupLambdaApiHandler(routesHandlerMap)

    // @ts-expect-error: incomplete parameters for handler() - enough for testing
    const getSampleRouteResponse = await handler({ routeKey: routeTestKey })

    expect(routesHandlerMap[routeTestKey].fn).not.toHaveBeenCalled()
    expect(getSampleRouteResponse.statusCode).toBe(500)
    expect(getSampleRouteResponse.body)
      .toBe(`{"message":"Internal server error.","payload":{"reason":"Handler disabled for this route: ${routeTestKey}"}}`)
  })

  it('should return 500 if route handler throws', async () => {
    const routeTestKey = 'GET /sample'
    const handler = setupLambdaApiHandler({
      [routeTestKey]: {
        enabled: true,
        fn: async (event) => {
          throw new Error('Error from route handler')
        }
      }
    })

    // @ts-expect-error: incomplete parameters for handler() - enough for testing
    const getSampleRouteResponse = await handler({ routeKey: routeTestKey })

    expect(getSampleRouteResponse.statusCode).toBe(500)
    expect(getSampleRouteResponse.body)
      .toBe('{"message":"Internal server error.","payload":{"reason":"Unexpected error!"}}')
  })
})

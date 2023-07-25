import { buildJsonResponse } from '../responseBuilders'

describe('AWS Lambda - Response builders', () => {
  it('should throw an error when http status code is not valid', async () => {
    const invalidStatusCode = 11
    expect(() => {
      // @ts-expect-error: buildJsonResponse cannot accept 11 as status code
      buildJsonResponse(invalidStatusCode, { message: '', payload: {} })
    }).toThrowError('Invalid Http Status Code')
  })
})

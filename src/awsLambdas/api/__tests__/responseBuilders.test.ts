import { buildJsonResponse } from '../responseBuilders'

describe('AWS Lambda - Response builders', () => {
  it('should throw an error when http status code is not valid', async () => {
    const invalidStatusCode = 11
    expect(() => {
      buildJsonResponse(invalidStatusCode, { message: '', payload: {} })
    }).toThrowError('Invalid Http Status Code')
  })
})

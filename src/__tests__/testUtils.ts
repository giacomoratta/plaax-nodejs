export const cloneJsonObject = (data: Record<string, any>): Record<string, any> => {
  return JSON.parse(JSON.stringify(data))
}

export const getMockedImplForDdbClient = (ddbClientInstance) => {
  // TODO: Possible solution to TS2339
  // import { DynamoDBClient as MockedDynamoDBClient } from '../../../../__mocks__/@aws-sdk/client-dynamodb'
  // const ddbClient = new MockedDynamoDBClient()// as unknown as jest.Mock

  return (fn): void => {
    // @@ts-expect-error: aws lib imported from __mock__ (fix TS2339)
    ddbClientInstance.send.mockImplementation(fn)
  }
}

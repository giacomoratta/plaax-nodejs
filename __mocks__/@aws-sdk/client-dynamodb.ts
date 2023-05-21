const _DynamoDBClientClassMocks = {
  send: jest.fn().mockReturnValue(Promise.resolve({}))
}

class _CommandGenericMock {
  public input: any

  constructor (input) {
    this.input = input
  }
}

export class PutItemCommand extends _CommandGenericMock {
  // constructor (input) {
  //   super(input)
  // }
}

export class GetItemCommand extends _CommandGenericMock {
  // constructor (input) {
  //   super(input)
  // }
}

export class QueryCommand extends _CommandGenericMock {
  // constructor (input) {
  //   super(input)
  // }
}

export class DynamoDBClient {
  public send: jest.Mock<any, any>

  constructor (config = {}) {
    this.send = _DynamoDBClientClassMocks.send
  }
}

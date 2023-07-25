const _DynamoDBClientClassMocks = {
  send: jest.fn().mockReturnValue(Promise.resolve({}))
}

class _CommandGenericMock {
  public input: any

  constructor (input) {
    this.input = input
  }
}

export class PutItemCommand extends _CommandGenericMock { }

export class GetItemCommand extends _CommandGenericMock { }

export class QueryCommand extends _CommandGenericMock { }

export class BatchGetItemCommand extends _CommandGenericMock { }

export class DynamoDBClient {
  public send: jest.Mock<any, any>

  constructor (/* config = {} */) {
    this.send = _DynamoDBClientClassMocks.send
  }
}

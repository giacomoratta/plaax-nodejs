export interface ApiGatewayEvent {
  'version': string // '2.0'
  'routeKey': string // 'GET /project/{projectId}'
  'rawPath': string // '/v1/project/123'
  'rawQueryString': string // 'beginTs=432432'
  'headers': Record<string, string>
  'queryStringParameters': Record<string, string>
  'requestContext': {
    'accountId': string
    'apiId': string
    'domainName': string // '3icqjbgvlg.execute-api.eu-west-1.amazonaws.com'
    'domainPrefix': string // '3icqjbgvlg'
    'http': {
      'method': string // 'GET'
      'path': string // '/v1/project/123'
      'protocol': string // 'HTTP/1.1'
      'sourceIp': string // '83.84.220.69'
      'userAgent': string // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
    }
    'requestId': string
    'routeKey': string // 'GET /project/{projectId}'
    'stage': string // 'v1'
    'time': string
    'timeEpoch': number
  }
  'pathParameters': Record<string, string>
  'isBase64Encoded': boolean
}

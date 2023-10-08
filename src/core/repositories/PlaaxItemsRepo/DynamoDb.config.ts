import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

const RESOURCE_PREFIX = process.env.RESOURCE_PREFIX ?? 'unknown'

const credentialsFromEnv = process.env.NODE_ENV !== 'production' && {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  // sessionToken: ''
  // expiration: '',
}

export const DynamoDBClientConfiguration: DynamoDBClientConfig = {
  credentials: credentialsFromEnv || undefined,
  region: process.env.AWS_DEFAULT_REGION ?? 'eu-west-1'
}

export const DynamoDbTables = {
  ITEMS: RESOURCE_PREFIX + '-items',
  USER_PROJECTS: RESOURCE_PREFIX + '-user-project'
}

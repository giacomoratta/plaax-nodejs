const RESOURCE_PREFIX = process.env.RESOURCE_PREFIX ?? 'unknown'

export const DynamoDBClientConfiguration = { region: 'eu-west-1' }

export const DynamoDbTables = {
  USER_PROJECTS: RESOURCE_PREFIX + '-user-project'
}

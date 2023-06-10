import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClientConfiguration, DynamoDbTables } from './DynamoDb.config'

import { UserProjectIdsList, UserProjectsList } from '../../models/User'
import { getProjectsById } from './items'
import { createLogger } from '../../logger'

const log = createLogger('repo/plaaxItems/userProjects')
const ddbClient = new DynamoDBClient(DynamoDBClientConfiguration)

export const getUserProjectIdsList = async (userId: number): Promise<UserProjectIdsList | undefined> => {
  const command = new QueryCommand({
    TableName: DynamoDbTables.USER_PROJECTS,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': { N: userId.toString() } }
  })

  const results = await ddbClient.send(command)
  if (results == null || results.Items == null || results.Items.length === 0) {
    log.debug({ results }, 'Empty result')
    return undefined
  }

  const userProjects: UserProjectIdsList = []
  results.Items.forEach(dbItem => {
    const intProjectId = parseInt(dbItem.projectId?.N ?? '')
    if (isNaN(intProjectId)) {
      log.warn({ dbItem }, 'Unexpected data found')
      return
    }
    userProjects.push(intProjectId)
  })

  log.debug({ userProjects }, 'Final user projects')
  if (userProjects.length === 0) return undefined
  return userProjects
}

export const getUserProjectsList = async (userId: number): Promise<UserProjectsList | undefined> => {
  const projectIds: UserProjectIdsList | undefined = await getUserProjectIdsList(userId)
  if (projectIds == null) return undefined
  return await getProjectsById(projectIds)
}

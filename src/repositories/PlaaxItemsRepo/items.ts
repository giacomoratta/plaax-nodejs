import { DynamoDBClient, BatchGetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClientConfiguration, DynamoDbTables } from './DynamoDb.config'

import { ProjectIdsList, ProjectItemsList } from '../../models/Item'
import { ProjectExpanded } from '../../models/ItemExpanded'

import * as translateToDb from './ddbTranslators/toDbModels'
import * as translateFromDb from './ddbTranslators/fromDbModels'

import { createLogger } from '../../logger'

const log = createLogger('repo/plaaxItems/items')
const ddbClient = new DynamoDBClient(DynamoDBClientConfiguration)

export const getExpandedProject = async (projectId: number): Promise<ProjectExpanded | undefined> => {
  const command = new QueryCommand({
    TableName: DynamoDbTables.ITEMS,
    KeyConditionExpression: 'projectId = :projectId',
    ExpressionAttributeValues: { ':projectId': { N: projectId.toString() } }
  })

  const results = await ddbClient.send(command)
  if (results == null || results.Items == null || results.Count === 0 || results.Items.length === 0) {
    log.debug({ results }, 'Empty result')
    return undefined
  }

  return translateFromDb.fromDbProjectItemsToProjectExpanded(results.Items)
}

export const getProjectsById = async (projectIds: ProjectIdsList): Promise<ProjectItemsList | undefined> => {
  const command = new BatchGetItemCommand({
    RequestItems: {
      [DynamoDbTables.ITEMS]: {
        Keys: projectIds.map(translateToDb.fromProjectIdToSingleProjectSearchCriteria)
      }
    }
  })

  const results = await ddbClient.send(command)
  if (
    results == null ||
    results.Responses == null ||
    results.Responses[DynamoDbTables.ITEMS] == null ||
    results.Responses[DynamoDbTables.ITEMS].length === 0
  ) {
    log.debug({ results }, 'Empty result')
    return undefined
  }

  return results.Responses[DynamoDbTables.ITEMS].map(translateFromDb.fromDbProjectToProjectItem)
}

import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClientConfiguration, DynamoDbTables } from './DynamoDb.config'

import { ProjectIdsList, ProjectItemsList } from '../../models/Item'
import { ProjectExpanded } from '../../models/ItemExpanded'

import * as translateToDb from './ddbTranslators/toDbModels'
import * as translateFromDb from './ddbTranslators/fromDbModels'

import { createLogger } from '../../logger'

const log = createLogger('repo/plaaxItems/items')
const ddbClient = new DynamoDBClient(DynamoDBClientConfiguration)

export const getExpandedProject = async (projectId: number): Promise<ProjectExpanded | undefined> => {
  return undefined
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

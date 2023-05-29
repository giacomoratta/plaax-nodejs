import * as translateFromDb from '../fromDbModels'
import { DynamoDbTables } from '../../DynamoDb.config'

import { cloneJsonObject } from '../../../../__tests__/testUtils'
import ddbProjectItemsFromDdb from '../../__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'

const getDdbProjectItems = (): Record<string, any> => {
  return ddbProjectItemsFromDdb.Responses[DynamoDbTables.ITEMS]
}

describe('getProjectsById: test data conversion', () => {
  it('should throw in case of invalid projectId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].projectId.N = 'abc'
    expect(() => translateFromDb.fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (projectId)')
  })

  it('should throw in case of invalid itemId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].itemId.N = 'abc'
    expect(() => translateFromDb.fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (itemId)')
  })

  it('should throw in case of invalid ownerUserId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].ownerUserId.N = 'abc'
    expect(() => translateFromDb.fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (ownerUserId)')
  })

  it('should return an empty array of assignedUserIds when undefined', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].assignedUserIds = undefined

    const projectItem = translateFromDb.fromDbProjectToProjectItem(ddbProjectItems[0])

    expect(projectItem.assignedUserIds).toBeTruthy()
    expect(projectItem.assignedUserIds.length >= 0).toBeTruthy()
  })

  it('should return timestamp fields as 0 when undefined', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].createTs = undefined
    ddbProjectItems[0].updateTs = undefined
    ddbProjectItems[0].archivedTs = undefined

    const projectItem = translateFromDb.fromDbProjectToProjectItem(ddbProjectItems[0])

    expect(projectItem.createTs).toBe(0)
    expect(projectItem.updateTs).toBe(0)
    expect(projectItem.archivedTs).toBeNull()
  })
})

import {
  fromDbProjectToProjectItem,
  fromDbProjectItemsToProjectExpanded
} from '../fromDbModels'
import { DynamoDbTables } from '../../DynamoDb.config'

import { type ProjectExpanded } from '../../../../models/ItemExpanded'

import { cloneJsonObject } from '../../../../__tests__/testUtils'
import ddbProjectItemsFromDdb from '../../__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'
import allProjectItemsP1001FromDdb from '../../__test-data-ddb__/allProjectItems-p1001.json'

import { projectExpandedP1001 } from '../../../../__tests__/__data-models__/projectExpanded-p1001'

const getDdbProjectItems = (): Record<string, any> => {
  return ddbProjectItemsFromDdb.Responses[DynamoDbTables.ITEMS]
}

const countProjectExpandedItems = (project: ProjectExpanded | undefined): number => {
  if (project == null) return 0
  let itemsCounter = 1
  project?.lists.forEach(list => {
    itemsCounter++
    list.activities.forEach(activity => {
      itemsCounter++
      activity.tasks.forEach(task => {
        itemsCounter++
      })
    })
  })
  return itemsCounter
}

describe('fromDbProjectToProjectItem', () => {
  it('should throw in case of invalid projectId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].projectId.N = 'abc'
    expect(() => fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (projectId)')
  })

  it('should throw in case of invalid itemId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].itemId.N = 'abc'
    expect(() => fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (itemId)')
  })

  it('should throw in case of invalid ownerUserId', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].ownerUserId.N = 'abc'
    expect(() => fromDbProjectToProjectItem(ddbProjectItems[0]))
      .toThrow('Parsed value is not a number. (ownerUserId)')
  })

  it('should return an empty array of assignedUserIds when undefined', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].assignedUserIds = undefined

    const projectItem = fromDbProjectToProjectItem(ddbProjectItems[0])

    expect(projectItem.assignedUserIds).toBeTruthy()
    expect(projectItem.assignedUserIds.length >= 0).toBeTruthy()
  })

  it('should return timestamp fields as 0 when undefined', async () => {
    const ddbProjectItems = cloneJsonObject(getDdbProjectItems())
    ddbProjectItems[0].createTs = undefined
    ddbProjectItems[0].updateTs = undefined
    ddbProjectItems[0].archivedTs = undefined

    const projectItem = fromDbProjectToProjectItem(ddbProjectItems[0])

    expect(projectItem.createTs).toBe(0)
    expect(projectItem.updateTs).toBe(0)
    expect(projectItem.archivedTs).toBeNull()
  })
})

describe('fromDbProjectItemsToProjectExpanded', () => {
  it('should get a project expanded', () => {
    const ddbItems = cloneJsonObject(allProjectItemsP1001FromDdb).Items
    const project = fromDbProjectItemsToProjectExpanded(ddbItems)

    expect(project).toMatchObject(projectExpandedP1001)
    expect(project).toBeTruthy()
    expect(ddbItems).toHaveLength(countProjectExpandedItems(project))
  })

  it('should return a project with no lists', () => {
    const ddbItem = cloneJsonObject(allProjectItemsP1001FromDdb.Items[0])
    const project = fromDbProjectItemsToProjectExpanded([ddbItem])

    expect(project).toBeTruthy()
    expect(project?.lists).toHaveLength(0)
  })

  it('should not throw when ddb-items array has not the main project item: return undefined project', () => {
    const ddbItems = (cloneJsonObject(allProjectItemsP1001FromDdb).Items).slice(1)
    const project = fromDbProjectItemsToProjectExpanded(ddbItems)

    expect(project).toBeUndefined()
  })

  it('should not throw when ddb-items array is empty: return undefined project', () => {
    const ddbItems = []
    const project = fromDbProjectItemsToProjectExpanded(ddbItems)

    expect(project).toBeUndefined()
  })

  it('should throw when listId is not a valid number', () => {
    const ddbItems = cloneJsonObject(allProjectItemsP1001FromDdb).Items
    ddbItems[3].listId.N = 'abc'
    expect(() => fromDbProjectItemsToProjectExpanded(ddbItems))
      .toThrow('Parsed value is not a number. (listId)')
  })

  it('should throw when activityId is not a valid number', () => {
    const ddbItems = cloneJsonObject(allProjectItemsP1001FromDdb).Items
    ddbItems[10].activityId.N = 'abc'
    expect(() => fromDbProjectItemsToProjectExpanded(ddbItems))
      .toThrow('Parsed value is not a number. (activityId)')
  })
})

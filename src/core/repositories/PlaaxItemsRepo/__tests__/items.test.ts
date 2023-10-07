import { getProjectsById } from '../items'
import { DynamoDbTables } from '../DynamoDb.config'

import { cloneJsonObject } from '../../../../__tests__/testUtils'
import projectItemsP1001P002 from '../__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'
import { projectItemsArrayP1001P1002 } from '../../../../__tests__/__data-models__/projectItemsArray-p1001-p1002'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
jest.mock('@aws-sdk/client-dynamodb')

describe('PlaaxItemsRepo: ITEMS', () => {
  const ddbClientInstance = new DynamoDBClient({})
  const mockImplementationOnceForDdbClient = (fn) => {
    // @ts-expect-error: TS2339 property does not exist on type
    ddbClientInstance.send.mockImplementationOnce(fn)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProjectsById: get a list of project items from a list of IDs', () => {
    it('should return a list of projects items', async () => {
      mockImplementationOnceForDdbClient(async () => { return projectItemsP1001P002 })
      const projectIdsList = [1001, 1002]
      const projectItemsArray = await getProjectsById(projectIdsList)
      expect(projectItemsArray).toHaveLength(2)

      projectItemsArray?.forEach((projectItem) => {
        expect(projectItem.projectId).not.toHaveProperty('N') /* check model conversion */
        expect(projectItem.archivedTs).toBeNull() /* check optional value */
        expect(projectItem.assignedUserIds.length >= 0).toBeTruthy()
        expect(projectItem.createTs > 0).toBeTruthy()
        expect(projectItem.updateTs > 0).toBeTruthy()
      })

      expect(projectItemsArray).toMatchObject(projectItemsArrayP1001P1002)
    })

    it('should return an empty list when ddb result is undefined', async () => {
      mockImplementationOnceForDdbClient(async () => { return undefined })
      expect(await getProjectsById([1, 2])).toBeUndefined()
    })

    it('should return an empty list when ddb Response is undefined', async () => {
      mockImplementationOnceForDdbClient(async () => { return { Responses: undefined } })
      expect(await getProjectsById([1, 2])).toBeUndefined()
    })

    it('should return an empty list when ddb Response has an unexpected table', async () => {
      mockImplementationOnceForDdbClient(async () => { return { Responses: ['another-table'] } })
      expect(await getProjectsById([1, 2])).toBeUndefined()
    })

    it('should return an empty list when ddb Response table is empty', async () => {
      mockImplementationOnceForDdbClient(async () => {
        return { Responses: { [Object.keys(projectItemsP1001P002.Responses)[0]]: [] } }
      })
      expect(await getProjectsById([1, 2])).toBeUndefined()
    })

    it('should throw when db request fails', async () => {
      mockImplementationOnceForDdbClient(async () => { throw new Error('Unexpected failure.') })
      await expect(async () => await getProjectsById([1, 2]))
        .rejects.toThrow('Unexpected failure.')
    })

    it('should throw in case of invalid projectId', async () => {
      mockImplementationOnceForDdbClient(async () => {
        const ddbResponse = cloneJsonObject(projectItemsP1001P002)
        const projectItems = ddbResponse.Responses[DynamoDbTables.ITEMS]
        projectItems[0].projectId.N = 'abc'
        return ddbResponse
      })
      await expect(async () => await getProjectsById([1, 2]))
        .rejects.toThrow('Parsed value is not a number. (projectId)')
    })

    it('should throw in case of invalid itemId', async () => {
      mockImplementationOnceForDdbClient(async () => {
        const ddbResponse = cloneJsonObject(projectItemsP1001P002)
        const projectItems = ddbResponse.Responses[DynamoDbTables.ITEMS]
        projectItems[0].itemId.N = 'abc'
        return ddbResponse
      })
      await expect(async () => await getProjectsById([1, 2]))
        .rejects.toThrow('Parsed value is not a number. (itemId)')
    })
  })
})

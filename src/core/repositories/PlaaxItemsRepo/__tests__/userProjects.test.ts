import { getUserProjectIdsList, getUserProjectsList } from '../userProjects'
import * as RepoItems from '../items'

import { cloneJsonObject } from '../../../../__tests__/testUtils'
import userProjectsU1005json from '../__test-data-ddb__/userProjects-u1005.json'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
jest.mock('@aws-sdk/client-dynamodb')

jest.mock('../items')
const mockedRepoItems = RepoItems as jest.Mocked<typeof RepoItems>

describe('PlaaxItemsRepo: USER', () => {
  const ddbClientInstance = new DynamoDBClient({})
  const mockImplementationOnceForDdbClient = (fn) => {
    // @ts-expect-error: TS2339 property does not exist on type
    ddbClientInstance.send.mockImplementationOnce(fn)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserProjectIdsList: get a list of numeric ids of projects associated to a specific user', () => {
    it('should return a list of projects where user=1005 is working on', async () => {
      mockImplementationOnceForDdbClient(async () => { return cloneJsonObject(userProjectsU1005json) })
      const userId = 1005
      expect(await getUserProjectIdsList(userId)).toMatchObject([1001, 1002])
    })

    it('should throw when db request fails', async () => {
      mockImplementationOnceForDdbClient(async () => { throw new Error('Unexpected failure.') })
      await expect(async () => await getUserProjectIdsList(1005)).rejects.toThrow('Unexpected failure.')
    })

    it('should return nothing when result is empty', async () => {
      mockImplementationOnceForDdbClient(async () => { return undefined })
      expect(await getUserProjectIdsList(1005)).toBeUndefined()
    })

    it('should return nothing when result has no items', async () => {
      mockImplementationOnceForDdbClient(async () => { return { Items: [] } })
      expect(await getUserProjectIdsList(1005)).toBeUndefined()
    })

    it('should return nothing when result has missing projectId', async () => {
      mockImplementationOnceForDdbClient(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        delete up1005.Items[0].projectId
        return up1005
      })
      expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })

    it('should return nothing when result has incomplete data for projectId', async () => {
      mockImplementationOnceForDdbClient(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        delete up1005.Items[0].projectId.N
        return up1005
      })
      expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })

    it('should skip the item when value is not expected', async () => {
      mockImplementationOnceForDdbClient(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        up1005.Items[0].projectId.N = 'wrong-number111'
        return up1005
      })
      expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })
  })

  describe('getUserProjectsList: get a list of project items associated to a specific user', () => {
    it('should return nothing when user has no projects', async () => {
      mockImplementationOnceForDdbClient(async () => { return { Items: [] } }) /* ddb response for getUserProjectIdsList */
      const userId = 1005
      expect(await getUserProjectsList(userId)).toBeUndefined()
      expect(mockedRepoItems.getProjectsById).not.toHaveBeenCalled()
    })

    it('should return a list of projects when user does have projects', async () => {
      mockImplementationOnceForDdbClient(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })
      const userId = 1005
      await getUserProjectsList(userId)
      expect(mockedRepoItems.getProjectsById).toHaveBeenCalledWith([1001, 1002])
    })

    it('should throw when db request for IDs fails', async () => {
      mockImplementationOnceForDdbClient(async () => { throw new Error('Unexpected failure.') })
      await expect(async () => await getUserProjectsList(1005)).rejects.toThrow('Unexpected failure.')
      expect(mockedRepoItems.getProjectsById).not.toHaveBeenCalled()
    })

    it('should throw when db request for project items fails', async () => {
      mockImplementationOnceForDdbClient(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })
      mockedRepoItems.getProjectsById.mockImplementation(async () => {
        throw new Error('Unexpected failure on project items.')
      })
      await expect(async () => await getUserProjectsList(1005))
        .rejects.toThrow('Unexpected failure on project items.')
      expect(mockedRepoItems.getProjectsById).toHaveBeenCalled()
    })
  })
})

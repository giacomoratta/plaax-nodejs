import { getUserProjectIdsList } from '../user'

import { cloneJsonObject, getMockedImplForDdbClient } from '../../../__tests__/testUtils'
import userProjectsU1005json from './__data__/userProjects-u1005.json'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
const ddbClient = new DynamoDBClient({})
const ddbClientSendMockImpl = getMockedImplForDdbClient(ddbClient)

describe('PlaaxItemsRepo: USER', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserProjectIdsList', () => {
    it('should return a list of projects where user=1005 is working on', async () => {
      ddbClientSendMockImpl(async () => { return userProjectsU1005json })
      const userId = 1005
      expect(await getUserProjectIdsList(userId)).toMatchObject([1001, 1002])
    })

    it('should throw when db request fails', async () => {
      ddbClientSendMockImpl(async () => { throw new Error('Unexpected failure.') })
      await expect(async () => await getUserProjectIdsList(1005)).rejects.toThrow('Unexpected failure.')
    })

    it('should return nothing when result is empty', async () => {
      ddbClientSendMockImpl(async () => { return undefined })
      await expect(await getUserProjectIdsList(1005)).toBeUndefined()
    })

    it('should return nothing when result has no items', async () => {
      ddbClientSendMockImpl(async () => { return { Items: [] } })
      await expect(await getUserProjectIdsList(1005)).toBeUndefined()
    })

    it('should return nothing when result has missing projectId', async () => {
      ddbClientSendMockImpl(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        delete up1005.Items[0].projectId
        return up1005
      })
      await expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })

    it('should return nothing when result has incomplete data for projectId', async () => {
      ddbClientSendMockImpl(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        delete up1005.Items[0].projectId.N
        return up1005
      })
      await expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })

    it('should skip the item when value is not expected', async () => {
      ddbClientSendMockImpl(async () => {
        const up1005 = cloneJsonObject(userProjectsU1005json)
        up1005.Items[0].projectId.N = 'wrong-number111'
        return up1005
      })
      await expect(await getUserProjectIdsList(1005)).toMatchObject([1002])
    })
  })
})

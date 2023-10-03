import handler from '../handler'

import userProjectsU1005json
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/userProjects-u1005.json'
import projectItemsP1001P002
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'
import allProjectItemsP1001FromDdb
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1001.json'
import allProjectItemsP1002FromDdb
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1002.json'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { cloneJsonObject, getMockedImplForDdbClient } from '../../../../../__tests__/testUtils'
const ddbClient = new DynamoDBClient({})
const ddbClientSendMockImpl = getMockedImplForDdbClient(ddbClient)

describe('Integration tests for AWS Lambda handler for API Gateway', () => {
  describe('GET /user/{userId}/projects', () => {
    const routeTestKey = 'GET /user/{userId}/projects'

    it('should not get user projects', async () => {
      // @ts-expect-error: incomplete parameters for handler() - enough for testing
      const apiResponse = await handler({
        routeKey: routeTestKey,
        pathParameters: { userId: '10115' }
      })

      expect(apiResponse.statusCode).toBe(404)
      expect(apiResponse.body).toBe('{"message":"The user 10115 is not associated to any project yet."}')
    })

    it('should get some user projects', async () => {
      ddbClientSendMockImpl(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })
      ddbClientSendMockImpl(async () => {
        /* ddb response for getProjectsById */
        return cloneJsonObject(projectItemsP1001P002)
      })

      // @ts-expect-error: incomplete parameters for handler() - enough for testing
      const apiResponse = await handler({
        routeKey: routeTestKey,
        pathParameters: { userId: '1005' }
      })

      expect(apiResponse.statusCode).toBe(200)
      expect(JSON.parse(apiResponse.body ?? '').payload).toHaveLength(2)
    })
  })

  describe('GET /board/user/{userId}', () => {
    const routeTestKey = 'GET /board/user/{userId}'

    it('should not get user board', async () => {
      // @ts-expect-error: incomplete parameters for handler() - enough for testing
      const apiResponse = await handler({
        routeKey: routeTestKey,
        pathParameters: { userId: '10115' }
      })

      expect(apiResponse.statusCode).toBe(404)
      expect(apiResponse.body).toBe('{"message":"Board not found for user 10115."}')
    })

    it('should get the user board', async () => {
      ddbClientSendMockImpl(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })
      ddbClientSendMockImpl(async () => {
        /* ddb response for getExpandedProject */
        return cloneJsonObject(allProjectItemsP1001FromDdb)
      })
      ddbClientSendMockImpl(async () => {
        /* ddb response for getExpandedProject */
        return cloneJsonObject(allProjectItemsP1002FromDdb)
      })

      // @ts-expect-error: incomplete parameters for handler() - enough for testing
      const apiResponse = await handler({
        routeKey: routeTestKey,
        pathParameters: { userId: '1005' }
      })
      const bodyPayload = JSON.parse(apiResponse.body ?? '').payload

      expect(apiResponse.statusCode).toBe(200)
      expect(bodyPayload).toHaveLength(2)
      expect(bodyPayload[0].projectId).toBe(1001)
      expect(bodyPayload[1].projectId).toBe(1002)
    })
  })
})

/*
* integration tests for the entire flow
*  - only dynamodb is mocked
*  - introduce ddb awareness in the integration tests
*  - in theory, nothing should be mocked in the middle
*/

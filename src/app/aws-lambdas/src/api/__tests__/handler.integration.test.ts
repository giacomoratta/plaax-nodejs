/*
* Integration tests for the full flow
*   - FLOW:
*     - from handler (w/ lambda event from API Gateway)
*     - to DynamoDb (w/ its raw data)
*   - APPROACH:
*     - "big bang" integration testing - all modules are integrated and tested at once, as a singular entity
*     - all modules involved are fully covered by unit-tests
*   - NOTES:
*     - only ddb is mocked
*     - introduce ddb awareness in the integration tests
*     - ideally, nothing should be mocked in the middle
*/

import handler from '../handler'

import { cloneJsonObject } from '../../../../../__tests__/testUtils'
import userProjectsU1005json
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/userProjects-u1005.json'
import projectItemsP1001P002
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'
import allProjectItemsP1001FromDdb
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1001.json'
import allProjectItemsP1002FromDdb
  from '../../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1002.json'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
jest.mock('@aws-sdk/client-dynamodb')

describe('Integration tests for AWS Lambda handler for API Gateway', () => {
  const ddbClientInstance = new DynamoDBClient({})
  const mockImplementationOnceForDdbClient = (fn) => {
    // @ts-expect-error: TS2339 property does not exist on type
    ddbClientInstance.send.mockImplementationOnce(fn)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

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
      mockImplementationOnceForDdbClient(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })

      mockImplementationOnceForDdbClient(async () => {
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
      mockImplementationOnceForDdbClient(async () => {
        /* ddb response for getUserProjectIdsList */
        return cloneJsonObject(userProjectsU1005json)
      })

      mockImplementationOnceForDdbClient(async () => {
        /* ddb response for getExpandedProject */
        return cloneJsonObject(allProjectItemsP1001FromDdb)
      })

      mockImplementationOnceForDdbClient(async () => {
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

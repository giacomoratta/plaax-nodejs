/*
* Integration tests for the full flow
*   - FLOW:
*     - from server API request
*     - to DynamoDb (w/ its raw data)
*   - APPROACH:
*     - "big bang" integration testing - all modules are integrated and tested at once, as a singular entity
*     - all modules involved are fully covered by unit-tests
*   - NOTES:
*     - only ddb is mocked
*     - introduce ddb awareness in the integration tests
*     - ideally, nothing should be mocked in the middle
*/

import { server } from '../server'
import request from 'supertest'

import { cloneJsonObject } from '../../../../__tests__/testUtils'
import userProjectsU1005json
  from '../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/userProjects-u1005.json'
import allProjectItemsP1001FromDdb
  from '../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1001.json'
import allProjectItemsP1002FromDdb
  from '../../../../core/repositories/PlaaxItemsRepo/__test-data-ddb__/allProjectItems-p1002.json'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const apiPrefix = '/rest/v1'

describe('Integration tests for the API', () => {
  const ddbClientInstance = new DynamoDBClient({})
  const mockImplementationOnceForDdbClient = (fn) => {
    // @ts-expect-error: TS2339 property does not exist on type
    ddbClientInstance.send.mockImplementationOnce(fn)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hello-world API', () => {
    it('should call /hello/world/:id', async () => {
      const paramIdValue = 'abc123'
      const response = await request(server.callback()).get(`${apiPrefix}/hello/world/${paramIdValue}`)

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({ helloId: paramIdValue })
    })
  })

  describe('GET /board/user/{userId}', () => {
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

      const userId = '1005'
      const response = await request(server.callback()).get(`${apiPrefix}/board/user/${userId}`)

      const bodyPayload = response.body.payload

      expect(response.statusCode).toEqual(200)
      expect(bodyPayload).toHaveLength(2)
      expect(bodyPayload[0].projectId).toBe(1001)
      expect(bodyPayload[1].projectId).toBe(1002)
    })
  })
})

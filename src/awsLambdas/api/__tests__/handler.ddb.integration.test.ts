import handler from '../handler'

import userProjectsU1005json
  from '../../../repositories/PlaaxItemsRepo/__test-data-ddb__/userProjects-u1005.json'
import projectItemsP1001P002
  from '../../../repositories/PlaaxItemsRepo/__test-data-ddb__/projectItems-getBatch-p1001-p1002.json'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { cloneJsonObject, getMockedImplForDdbClient } from '../../../__tests__/testUtils'
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
      expect(apiResponse.body).toBe('{"message":"The user 10115 is not associated to any project yet.","payload":{}}')
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
})

/*
* integration tests for the entire flow
*  - only dynamodb is mocked
*  - introduce ddb awareness in the integration tests
*  - in theory, nothing should be mocked in the middle
*/

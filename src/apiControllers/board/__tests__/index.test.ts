import { getByUserProjectId /* getByUserId, createItem */ } from '../index'

import project1001FullBoardApi from '../__data__/project-1001-full-board-api.json'

import * as PlaaxItemsRepo from '../../../repositories/PlaaxItemsRepo'
import { jsonToProjectFull } from '../test.utils'

jest.mock('../../../repositories/PlaaxItemsRepo')
const mockedPlaaxItemsRepo = PlaaxItemsRepo as jest.Mocked<typeof PlaaxItemsRepo>

describe('API Controller: board', () => {
  describe('GET user board of 1 project', () => {
    it('should respond with 200', async () => {
      const ctx = {
        params: { userId: '1005', projectId: '1001' },
        status: undefined,
        body: undefined
      }

      mockedPlaaxItemsRepo.getUserProjectBoard.mockImplementation(async () => {
        // todo: return data as models
        // todo: try to return data from api controller... maybe the test will fail
        return jsonToProjectFull(project1001FullBoardApi)
      })

      await getByUserProjectId(ctx)

      expect(mockedPlaaxItemsRepo.getUserProjectBoard).toHaveBeenCalledTimes(1) // todo: called with...
      expect(ctx.body).toMatchObject(project1001FullBoardApi)
      expect(ctx.status).toEqual(200)
    })
  })
})

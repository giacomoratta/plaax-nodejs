import { getBoard } from '../getBoard'

import project1001FullBoardApi from '../__data__/project-1001-full-api.json'

import * as PlaaxItemsRepo from '../../repositories/PlaaxItemsRepo/board'
import { jsonToProjectExpanded } from './test.utils'

jest.mock('../../repositories/PlaaxItemsRepo')
const mockedPlaaxItemsRepo = PlaaxItemsRepo as jest.Mocked<typeof PlaaxItemsRepo>

describe('API Controller: board', () => {
  describe('GET user board of 1 project', () => {
    it('should respond with 200', async () => {
      // todo: remove ctx because is not infra-detached (related to Koa)
      const ctx = {
        params: { userId: '1005', projectId: '1001' },
        status: undefined,
        body: undefined
      }

      mockedPlaaxItemsRepo.getExpandedUserBoard.mockImplementation(
        // @ts-expect-error: it could return undefined
        async () => {
          // todo: return data as models
          // todo: try to return data from api controller... maybe the test will fail
          return jsonToProjectExpanded(project1001FullBoardApi)
        })

      await getBoard('1234')

      expect(mockedPlaaxItemsRepo.getExpandedUserBoard).toHaveBeenCalledTimes(1) // todo: called with...
      expect(ctx.body).toMatchObject(project1001FullBoardApi)
      expect(ctx.status).toEqual(200)
    })
  })

  // describe('GET full user board with many projects', () => {})
})

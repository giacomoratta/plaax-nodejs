import { getUserBoard } from '../board.controller'

import * as PlaaxBoardRepo from '../../repositories/PlaaxItemsRepo/board'

jest.mock('../../repositories/PlaaxItemsRepo/board')
const mockedPlaaxBoardRepo = PlaaxBoardRepo as jest.Mocked<typeof PlaaxBoardRepo>

describe('API Controller: board', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUserBoard: Get the full board of one user', () => {
    it('should call the right repo function with the correct parameter', async () => {
      await getUserBoard('1002')
      expect(mockedPlaaxBoardRepo.getExpandedUserBoard).toHaveBeenCalledWith(1002)
    })

    it('should throw when repo function throws', async () => {
      mockedPlaaxBoardRepo.getExpandedUserBoard.mockImplementation(async () => {
        throw new Error('Unexpected failure.')
      })
      const apiResponse = await getUserBoard('1002')
      expect(apiResponse.error?.message).toBe('Unexpected failure.')
    })

    it('should throw when userId is not valid', async () => {
      const apiResponse = await getUserBoard('0dfa02')
      expect(apiResponse.error?.message).toBe('Invalid userId (\'0dfa02\'). Expected numbers only.')
    })
  })
})

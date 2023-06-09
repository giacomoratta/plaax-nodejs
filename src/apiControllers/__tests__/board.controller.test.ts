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
      await expect(async () => await getUserBoard('1002')).rejects.toThrow('Unexpected failure.')
    })

    it('should throw when userId is not valid', async () => {
      await expect(async () => await getUserBoard('0dfa02'))
        .rejects.toThrow('Invalid userId (\'0dfa02\'). Expected numbers only.')
    })
  })
})

import { getUserProjects } from '../userProjects.controller'

import * as UserProjectsRepo from '../../repositories/PlaaxItemsRepo/userProjects'

jest.mock('../../repositories/PlaaxItemsRepo/userProjects')
const mockedUserProjectsRepo = UserProjectsRepo as jest.Mocked<typeof UserProjectsRepo>

describe('API Controller: user-projects', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUserProjects: Get all projects of one user', () => {
    it('should call the right repo function with the correct parameter', async () => {
      await getUserProjects('1002')
      expect(mockedUserProjectsRepo.getUserProjectsList).toHaveBeenCalledWith(1002)
    })

    it('should throw when repo function throws', async () => {
      const errorMessage = 'getUserProjectsList: unexpected failure.'
      mockedUserProjectsRepo.getUserProjectsList.mockImplementation(async () => {
        throw new Error(errorMessage)
      })
      await expect(getUserProjects('1002')).rejects.toThrow(errorMessage)
    })

    it('should throw when userId is not valid', async () => {
      const errorMessage = 'Invalid userId (\'0dfa02\'). Expected numbers only.'
      await expect(getUserProjects('0dfa02')).rejects.toThrow(errorMessage)
    })
  })
})

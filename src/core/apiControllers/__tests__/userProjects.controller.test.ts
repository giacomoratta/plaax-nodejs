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
      mockedUserProjectsRepo.getUserProjectsList.mockImplementation(async () => {
        throw new Error('Unexpected failure.')
      })
      await expect(async () => await getUserProjects('1002')).rejects.toThrow('Unexpected failure.')
    })

    it('should throw when userId is not valid', async () => {
      await expect(async () => await getUserProjects('0dfa02'))
        .rejects.toThrow('Invalid userId (\'0dfa02\'). Expected numbers only.')
    })
  })
})

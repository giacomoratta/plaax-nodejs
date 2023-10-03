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
      const apiResponse = await getUserProjects('1002')
      expect(apiResponse.error?.message).toBe('Unexpected failure.')
    })

    it('should throw when userId is not valid', async () => {
      const apiResponse = await getUserProjects('0dfa02')
      expect(apiResponse.error?.message).toBe('Invalid userId (\'0dfa02\'). Expected numbers only.')
    })
  })
})

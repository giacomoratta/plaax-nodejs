import { getExpandedUserBoard } from '../board'
import * as RepoItems from '../items'
import * as RepoUserProjects from '../userProjects'

import { projectExpandedP1001 } from '../../../../__tests__/__data-models__/projectExpanded-p1001'
import { projectExpandedP1002 } from '../../../../__tests__/__data-models__/projectExpanded-p1002'

jest.mock('../items')
jest.mock('../userProjects')
const mockedRepoItems = RepoItems as jest.Mocked<typeof RepoItems>
const mockedRepoUserProjects = RepoUserProjects as jest.Mocked<typeof RepoUserProjects>

describe('PlaaxItemsRepo: BOARD', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getExpandedUserBoard: get the full user board with all items', () => {
    it('should return the full user board', async () => {
      mockedRepoUserProjects.getUserProjectIdsList.mockImplementationOnce(async () => [1001, 1002])
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => projectExpandedP1001)
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => projectExpandedP1002)

      const userProjectsOnBoard = await getExpandedUserBoard(1005)
      expect(userProjectsOnBoard).toMatchObject([projectExpandedP1001, projectExpandedP1002])
    })

    it('should return undefined if the user has no projects', async () => {
      mockedRepoUserProjects.getUserProjectIdsList.mockImplementationOnce(async () => undefined)

      const userProjectsOnBoard = await getExpandedUserBoard(1005)
      expect(userProjectsOnBoard).toBeUndefined()
      expect(mockedRepoItems.getExpandedProject).not.toHaveBeenCalled()
    })

    it('should be robust against one failure on a expanded project query', async () => {
      mockedRepoUserProjects.getUserProjectIdsList.mockImplementationOnce(async () => [1001, 1011, 1015, 1002])
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => projectExpandedP1001)
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => { throw new Error('error on 1011') })
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => { throw new Error('error on 1015') })
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => projectExpandedP1002)

      const userProjectsOnBoard = await getExpandedUserBoard(1005)
      expect(userProjectsOnBoard).toMatchObject([projectExpandedP1001, projectExpandedP1002])
      expect(mockedRepoItems.getExpandedProject).toHaveBeenCalledTimes(4)
    })

    it('should return undefined when all queries for expanded project fail or return undefined', async () => {
      mockedRepoUserProjects.getUserProjectIdsList.mockImplementationOnce(async () => [1001, 1011, 1002])
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => { throw new Error('error on 1001') })
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => { return undefined })
      mockedRepoItems.getExpandedProject.mockImplementationOnce(async () => { throw new Error('error on 1002') })

      const userProjectsOnBoard = await getExpandedUserBoard(1005)
      expect(userProjectsOnBoard).toBeUndefined()
      expect(mockedRepoItems.getExpandedProject).toHaveBeenCalledTimes(3)
    })

    it('should throw when repo function fails on getting user project ids', async () => {
      mockedRepoUserProjects.getUserProjectIdsList.mockImplementationOnce(async () => {
        throw new Error('error on user projects')
      })

      await expect(async () => await getExpandedUserBoard(1005)).rejects.toThrow('error on user projects')
    })
  })
})

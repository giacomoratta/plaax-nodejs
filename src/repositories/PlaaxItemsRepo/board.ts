import { ProjectExpanded } from '../../models/ItemExpanded'

import { getUserProjectIdsList } from './userProjects'
import { getExpandedProject } from './items'

import { createLogger } from '../../logger'

const log = createLogger('repo/plaaxItems/board')

export const getExpandedUserBoard = async (userId: number): Promise<ProjectExpanded[] | undefined> => {
  const userProjectsList = await getUserProjectIdsList(userId)
  if (userProjectsList === undefined) return undefined

  const projectBoardPromises =
      userProjectsList.map(async (projectId): Promise<ProjectExpanded | undefined> => {
        return await getExpandedProject(projectId)
      })

  const fullProjects = await Promise.all(projectBoardPromises)

  const projectBoard: ProjectExpanded[] = []
  fullProjects.forEach((project, index) => {
    if (project !== undefined) {
      projectBoard.push(project)
    } else {
      log.warn(`Project ${userProjectsList[index]} not found.`)
    }
  })

  if (projectBoard.length === 0) {
    log.debug(`No projects on the board for user ${userId}`)
    return undefined
  }
  return projectBoard
}

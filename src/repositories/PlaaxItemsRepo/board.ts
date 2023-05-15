import { ProjectExpanded } from '../../models/ItemsExpanded'
import { getUserProjectsList } from './user'

export const getExpandedUserBoard = async (userId: string): Promise<ProjectExpanded[] | undefined> => {
  const userProjectsList = await getUserProjectsList(userId)
  if (userProjectsList === undefined) return undefined

  const projectBoardPromises =
      userProjectsList.map(async (projectId): Promise<ProjectExpanded | undefined> => {
        return await getExpandedProject(projectId)
      })

  const fullProjects = await Promise.all(projectBoardPromises)

  const projectBoard: ProjectExpanded[] = []
  fullProjects.forEach((project) => {
    if (project !== undefined) {
      projectBoard.push(project)
    }
  })

  if (projectBoard.length === 0) return undefined
  return projectBoard
}

const getExpandedProject = async (projectId: number): Promise<ProjectExpanded | undefined> => {
  return undefined
}

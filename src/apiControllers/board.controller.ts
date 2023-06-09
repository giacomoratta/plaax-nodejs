import { assertValidUserId } from './apiValidators'
import { getExpandedUserBoard } from '../repositories/PlaaxItemsRepo/board'
import { ProjectExpanded } from '../models/ItemExpanded'

export const getUserBoard = async (userId: string): Promise<ProjectExpanded[] | undefined> => {
  const intUserId = assertValidUserId(userId)
  return await getExpandedUserBoard(intUserId)
}

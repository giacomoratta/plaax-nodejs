import { assertValidUserId } from './apiValidators'
import { getExpandedUserBoard } from '../repositories/PlaaxItemsRepo/board'

export const getUserBoard = async (userId: string): Promise<Record<string, any> | undefined> => {
  const intUserId = assertValidUserId(userId)
  return await getExpandedUserBoard(intUserId)
}

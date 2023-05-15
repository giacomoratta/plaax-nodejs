import { assertValidUserId } from './validators'
import { getExpandedUserBoard } from '../repositories/PlaaxItemsRepo/board'

export const getBoard = async (userId: string): Promise<Record<string, any> | undefined> => {
  assertValidUserId(userId)
  return await getExpandedUserBoard(userId) // todo: extra checks?
}

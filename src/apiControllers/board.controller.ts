import { assertValidUserId } from './apiValidators'
import { getExpandedUserBoard } from '../repositories/PlaaxItemsRepo/board'

export const getUserBoard = async (userId: string): Promise<Record<string, any> | undefined> => {
  assertValidUserId(userId)
  return await getExpandedUserBoard(parseInt(userId)) // todo: extra checks?
}

import { assertValidUserId } from './apiValidators'
import { ApiResponse, dataNotFoundResponse, successResponse } from './apiResponseBuilders'
import { getExpandedUserBoard } from '../repositories/PlaaxItemsRepo/board'

export const getUserBoard = async (userId: string): Promise<ApiResponse> => {
  const intUserId = assertValidUserId(userId)
  const data = await getExpandedUserBoard(intUserId)
  if (data == null) {
    return dataNotFoundResponse(`Board not found for user ${userId}.`)
  }
  return successResponse('Board for user ' + userId, data)
}

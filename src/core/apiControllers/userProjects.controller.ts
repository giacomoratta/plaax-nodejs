import { assertValidUserId } from './apiValidators'
import { ApiResponse, dataNotFoundResponse, successResponse, genericErrorResponse } from './apiResponseBuilders'
import { getUserProjectsList } from '../repositories/PlaaxItemsRepo/userProjects'

export const getUserProjects = async (userId: string): Promise<ApiResponse> => {
  try {
    const intUserId = assertValidUserId(userId)
    const data = await getUserProjectsList(intUserId)
    if (data == null) {
      return dataNotFoundResponse(`The user ${userId} is not associated to any project yet.`)
    }
    return successResponse('Projects for the user ' + userId, data)
  } catch (error) {
    return genericErrorResponse(error)
  }
}

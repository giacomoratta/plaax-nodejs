import { assertValidUserId } from './apiValidators'
import { getUserProjectsList } from '../repositories/PlaaxItemsRepo/userProjects'
import { type UserProjectsList } from '../models/User'

export const getUserProjects = async (userId: string): Promise<UserProjectsList | undefined> => {
  const intUserId = assertValidUserId(userId)
  return await getUserProjectsList(intUserId)
}

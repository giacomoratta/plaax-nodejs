import { assertValidUserId } from './apiValidators'
import { getUserProjectsList } from '../repositories/PlaaxItemsRepo/userProjects'
import { UserProjectsList } from '../models/User'

export const getUserProjects = async (userId: string): Promise<UserProjectsList | undefined> => {
  assertValidUserId(userId)
  return await getUserProjectsList(parseInt(userId))
}

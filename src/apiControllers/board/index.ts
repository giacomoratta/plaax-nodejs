import * as PlaaxItemsRepo from '../../repositories/PlaaxItemsRepo'

export const getByUserId = async (ctx): Promise<void> => {
  const { userId } = ctx.params
  try {
    const data = await PlaaxItemsRepo.getFullUserBoard(userId)
    ctx.body = data /* convert? */
    ctx.status = 200
  } catch (error) {
    ctx.status = 500
  }
}

export const getByUserProjectId = async (ctx): Promise<void> => {
  const { userId, projectId } = ctx.params
  try {
    const data = await PlaaxItemsRepo.getUserProjectBoard(userId, projectId)
    ctx.body = data /* convert? */
    ctx.status = 200
  } catch (error) {
    ctx.status = 500
  }
}

export const createItem = async (ctx): Promise<void> => {
  ctx.status = 200
  ctx.body = { }
}

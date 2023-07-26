import { createLogger } from '../../logger'

const log = createLogger('api/helloWorld')

export const getById = async (ctx): Promise<void> => {
  const helloId: string = ctx.params.id
  log.debug('Called hello world api controller', helloId)
  ctx.status = 200
  ctx.body = { helloId }
}

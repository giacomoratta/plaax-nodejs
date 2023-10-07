import KoaRouter from '@koa/router'
import * as boardApiController from '../../../../core/apiControllers/board.controller'
import * as apiHelloWorld from '../../../../core/apiControllers/helloWorld'
import { toServerApiResponseContext } from './serverResponseBuilders'

export const createRestApiV1Router = (): KoaRouter => {
  const router = new KoaRouter({
    prefix: '/rest/v1'
  })

  router
    .get('/hello/world/:id', apiHelloWorld.getById)
    .get('/board/user/:userId', async (ctx): Promise<void> => {
      const userId: string = ctx.params.userId
      const data = await boardApiController.getUserBoard(userId)
      toServerApiResponseContext(ctx, data)
    })
  // .get('/board/:userId/:projectId', apiBoard.getByUserProjectId)
  // .post('/board/item', apiBoard.createItem)
  // .get('/calendar/:userId/:from/:to', apiCalendar.getByUserId)
  // .get('/calendar/:userId/:projectId/:from/:to', apiCalendar.getByUserProjectId)
  // .post('/calendar/item', apiCalendar.addItemToCalendar)

  return router
}

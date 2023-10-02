import Koa from 'koa'
import KoaRouter from '@koa/router'
import { httpLogger } from './http-logger'
import serverStateMiddleware from './state.middleware'

import * as apiHelloWorld from '../../../core/apiControllers/helloWorld'
import * as boardApiController from '../../../core/apiControllers/board.controller'

export const server = new Koa()

/* Keep all route definitions here for better readability */
export const router = new KoaRouter({
  prefix: '/rest/v1'
})

router
  .get('/hello/world/:id', apiHelloWorld.getById)
  .get('/board/user/:userId', async (ctx): Promise<void> => {
    const userId: string = ctx.params.userId
    const data = await boardApiController.getUserBoard(userId)
    if (data == null) {
      ctx.status = 404
      ctx.body = { message: `Board not found for user ${userId}.` }
    } else {
      ctx.status = 200
      ctx.body = data
    }
  })
  // .get('/board/:userId/:projectId', apiBoard.getByUserProjectId)
  // .post('/board/item', apiBoard.createItem)
  // .get('/calendar/:userId/:from/:to', apiCalendar.getByUserId)
  // .get('/calendar/:userId/:projectId/:from/:to', apiCalendar.getByUserProjectId)
  // .post('/calendar/item', apiCalendar.addItemToCalendar)

server
  .use(httpLogger)
  .use(serverStateMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())

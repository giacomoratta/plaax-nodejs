import Koa from 'koa'
import KoaRouter from '@koa/router'
import serverStateMiddleware from './state.middleware'

import * as apiHelloWorld from '../apiControllers/helloWorld'

export const server = new Koa()

/* Keep all route definitions here for better readability */
export const router = new KoaRouter({
  prefix: '/rest/v1'
})

router
  .get('/hello/world/:id', apiHelloWorld.getById)
  // .get('/board/:userId', apiBoard.getByUserId)
  // .get('/board/:userId/:projectId', apiBoard.getByUserProjectId)
  // .post('/board/item', apiBoard.createItem)
  // .get('/calendar/:userId/:from/:to', apiCalendar.getByUserId)
  // .get('/calendar/:userId/:projectId/:from/:to', apiCalendar.getByUserProjectId)
  // .post('/calendar/item', apiCalendar.addItemToCalendar)

server
  .use(serverStateMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())

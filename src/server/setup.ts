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

server
  .use(serverStateMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())

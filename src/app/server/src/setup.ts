import Koa from 'koa'
import KoaRouter from '@koa/router'
import { httpLogger } from './http-logger'
import { stateMiddleware, genericErrorHandler } from './middlewares'
import { addRouteHandlers } from './api/routeHandlers'

export const server = new Koa()

/* Keep all route definitions here for better readability */
export const router = new KoaRouter({
  prefix: '/rest/v1'
})

addRouteHandlers(router)

server
  .use(genericErrorHandler)
  .use(httpLogger)
  .use(stateMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())

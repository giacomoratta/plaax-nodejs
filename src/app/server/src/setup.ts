import Koa from 'koa'
import { httpLogger } from './http-logger'
import { stateMiddleware, genericErrorHandler } from './middlewares'
import { createRestApiV1Router } from './api/restApiV1Router'

export const server = new Koa()

export const routerRestApiV1 = createRestApiV1Router()

server
  .use(genericErrorHandler)
  .use(httpLogger)
  .use(stateMiddleware)
  .use(routerRestApiV1.routes())
  .use(routerRestApiV1.allowedMethods())

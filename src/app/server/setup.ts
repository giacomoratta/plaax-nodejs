import Koa from 'koa'
import KoaRouter from '@koa/router'
import serverStateMiddleware from './state.middleware'

import { apiHelloWorldById } from '../apiControllers'

const server = new Koa()

const router = new KoaRouter({
  prefix: '/rest/v1'
})

router
  .get('/hello/world/:id', apiHelloWorldById)

server
  .use(serverStateMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())

export default server

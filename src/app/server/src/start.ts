import './env'
import { server } from './server'
import { createLogger } from '../../../core/logger'

const log = createLogger('server-start')

// prevent open handles after running all tests
// (together with server.callback into the tests, instead of opening a listener just for tests)
if (process.env.NODE_ENV !== 'test') {
  const serverPort = process.env.PORT ?? 3000
  server.listen(serverPort)

  log.info(`Server listening on port ${serverPort}...`)
}

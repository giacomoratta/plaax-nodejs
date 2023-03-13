import * as dotenv from 'dotenv'

import { server } from './setup'
dotenv.config()

// prevent open handles after running all tests
if (process.env.NODE_ENV !== 'test') {
  const serverPort = process.env.PORT ?? 3000
  server.listen(serverPort)
}

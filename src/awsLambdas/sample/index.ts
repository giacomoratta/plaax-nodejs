import { throwSampleError } from '../../repositories/sampleErrorThrown'
import { createLogger } from '../../logger'

const log = createLogger('awsLambda/api/index')

export const handler = async (event: Record<string, any>, context: Record<string, any>): Promise<string> => {
  log.debug({ event }, 'Event received by sample lambda')
  throwSampleError()
  return context.logStreamName
}

export const handler = async (event: Record<string, any>, context: Record<string, any>): Promise<string> => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2))
  return context.logStreamName
}

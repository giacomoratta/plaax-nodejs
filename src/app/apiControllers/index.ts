export const apiHelloWorldById = async (ctx): Promise<void> => {
  const helloId: string = ctx.params.id
  console.log('Called hello world api controller', helloId)
  ctx.status = 200
  ctx.body = { helloId }
}

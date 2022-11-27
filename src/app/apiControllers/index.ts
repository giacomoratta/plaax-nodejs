export const apiHelloWorldById = async (ctx): Promise<void> => {
  const helloId: string = ctx.params.id
  ctx.status = 200
  ctx.body = { helloId }
}

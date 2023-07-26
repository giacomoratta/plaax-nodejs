export default async (ctx, next): Promise<void> => {
  ctx.state.gateways = {}
  ctx.state.services = {}
  await next()
}

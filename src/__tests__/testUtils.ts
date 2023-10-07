export const cloneJsonObject = (data: Record<string, any>): Record<string, any> => {
  return JSON.parse(JSON.stringify(data))
}

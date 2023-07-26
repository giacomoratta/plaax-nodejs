import { type ddbItemPrimaryKey } from '../ddbModels/Item'

export const fromProjectIdToSingleProjectSearchCriteria = (projectId: number): ddbItemPrimaryKey => {
  return {
    projectId: {
      N: projectId.toString()
    },
    itemId: {
      N: projectId.toString()
    }
  }
}

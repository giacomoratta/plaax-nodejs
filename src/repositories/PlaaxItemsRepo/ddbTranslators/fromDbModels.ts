import { ddbGenericItem, ddbProjectItem } from '../ddbModels/Item'
import { GenericItem, ProjectItem } from '../../../models/Item'
// import { createLogger } from '../../logger'

// const log = createLogger('repo/plaaxItems/translateFromDb')

const parseIntWithFallback = (originalValue: string, fallback: number): number => {
  if (originalValue == null) return fallback
  const intValue = parseInt(originalValue)
  if (isNaN(intValue)) return fallback
  return intValue
}

const parseIntOrThrow = (originalValue: string, errorInfo: string): number => {
  if (originalValue == null) {
    throw new TypeError(`Value is not a number. (${errorInfo})`)
  }
  const intValue = parseInt(originalValue)
  if (isNaN(intValue)) {
    throw new TypeError(`Parsed value is not a number. (${errorInfo})`)
  }
  return intValue
}

const fromDbGenericItemToGenericItem = (genericItem: ddbGenericItem): GenericItem => {
  return {
    projectId: parseIntOrThrow(genericItem.projectId?.N, 'projectId'),
    itemId: parseIntOrThrow(genericItem.itemId?.N, 'itemId'),
    ownerUserId: parseIntOrThrow(genericItem.ownerUserId?.N, 'ownerUserId'),
    assignedUserIds: (genericItem.assignedUserIds?.NS ?? []).map((value) => parseIntWithFallback(value, 0)),
    title: genericItem.title.S,
    createTs: parseIntWithFallback(genericItem.createTs?.N, 0),
    updateTs: parseIntWithFallback(genericItem.updateTs?.N, 0),
    archivedTs: genericItem.archivedTs != null ? parseIntWithFallback(genericItem.archivedTs.N, 0) : null
  }
}

export const fromDbProjectToProjectItem = (projectItem: ddbProjectItem): ProjectItem => {
  return fromDbGenericItemToGenericItem(projectItem)
}

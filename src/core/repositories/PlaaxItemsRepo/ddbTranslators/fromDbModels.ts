import { type ddbActivityItem, type ddbGenericItem, type ddbListItem, type ddbProjectItem, type ddbTaskItem }
  from '../ddbModels/Item'
import { type GenericItem, type ProjectItem, type TaskItem } from '../../../models/Item'
import { type ActivityExpanded, type ListExpanded, type ProjectExpanded } from '../../../models/ItemExpanded'
// import { createLogger } from '../../logger'

// const log = createLogger('repo/plaaxItems/translateFromDb')

const PARSE = {
  IntWithFallback: (originalValue: string, fallback: number): number => {
    if (originalValue == null) return fallback
    const intValue = parseInt(originalValue)
    if (isNaN(intValue)) return fallback
    return intValue
  },
  IntOrThrow: (originalValue: string, errorInfo: string): number => {
    if (originalValue == null) {
      throw new TypeError(`Value is not a number. (${errorInfo})`)
    }
    const intValue = parseInt(originalValue)
    if (isNaN(intValue)) {
      throw new TypeError(`Parsed value is not a number. (${errorInfo})`)
    }
    return intValue
  }
}

const IS = {
  DdbProject: (item: Record<string, any>) => {
    return item.projectId.N === item.itemId.N
  },
  DdbList: (item: Record<string, any>) => {
    return item.projectId.N !== item.itemId.N && item.listId === undefined
  },
  DdbActivity: (item: Record<string, any>) => {
    return item.projectId.N !== item.itemId && item.listId.N !== undefined && item.activityId === undefined
  },
  DdbTask: (item: Record<string, any>) => {
    return item.projectId.N !== item.itemId && item.listId.N !== undefined && item.activityId !== undefined
  }
}

const fromDbGenericItemToGenericItem = (genericItem: ddbGenericItem): GenericItem => {
  return {
    projectId: PARSE.IntOrThrow(genericItem.projectId?.N, 'projectId'),
    itemId: PARSE.IntOrThrow(genericItem.itemId?.N, 'itemId'),
    ownerUserId: PARSE.IntOrThrow(genericItem.ownerUserId?.N, 'ownerUserId'),
    assignedUserIds: (genericItem.assignedUserIds?.NS ?? []).map((value) => PARSE.IntWithFallback(value, 0)),
    title: genericItem.title.S,
    createTs: PARSE.IntWithFallback(genericItem.createTs?.N, 0),
    updateTs: PARSE.IntWithFallback(genericItem.updateTs?.N, 0),
    archivedTs: genericItem.archivedTs != null ? PARSE.IntWithFallback(genericItem.archivedTs.N, 0) : null
  }
}

const fromDbProjectToProjectExpanded = (projectItem: ddbProjectItem): ProjectExpanded => {
  return {
    ...fromDbGenericItemToGenericItem(projectItem),
    lists: []
  }
}

const fromDbListToListExpanded = (listItem: ddbListItem): ListExpanded => {
  return {
    ...fromDbGenericItemToGenericItem(listItem),
    activities: []
  }
}

const fromDbActivityToActivityExpanded = (activityItem: ddbActivityItem): ActivityExpanded => {
  return {
    ...fromDbGenericItemToGenericItem(activityItem),
    listId: PARSE.IntOrThrow(activityItem.listId?.N, 'listId'),
    tasks: []
  }
}

const fromDbTaskToTaskItem = (taskItem: ddbTaskItem): TaskItem => {
  return {
    ...fromDbGenericItemToGenericItem(taskItem),
    listId: PARSE.IntOrThrow(taskItem.listId?.N, 'listId'),
    activityId: PARSE.IntOrThrow(taskItem.activityId?.N, 'activityId')
  }
}

export const fromDbProjectToProjectItem = (projectItem: ddbProjectItem): ProjectItem => {
  return fromDbGenericItemToGenericItem(projectItem)
}

export const fromDbProjectItemsToProjectExpanded = (resultItems: Record<string, any>): ProjectExpanded | undefined => {
  let project: ProjectExpanded | undefined

  const projectLists: ListExpanded[] = []
  const activitiesByListId: Record<string, ActivityExpanded[]> = {}
  const tasksByActivityId: Record<string, TaskItem[]> = {}

  resultItems.forEach((item) => {
    if (IS.DdbProject(item)) {
      project = fromDbProjectToProjectExpanded(item)
    } else if (IS.DdbList(item)) {
      const list = fromDbListToListExpanded(item)
      projectLists.push(list)
    } else if (IS.DdbActivity(item)) {
      const activity = fromDbActivityToActivityExpanded(item)
      if (activitiesByListId[activity.listId] == null) activitiesByListId[activity.listId] = []
      activitiesByListId[activity.listId].push(activity)
    } else if (IS.DdbTask(item)) {
      const task = fromDbTaskToTaskItem(item)
      if (tasksByActivityId[task.activityId] == null) tasksByActivityId[task.activityId] = []
      tasksByActivityId[task.activityId].push(task)
    }
  })

  if (project != null) {
    project.lists = projectLists ?? []
    project.lists.forEach(list => {
      list.activities = activitiesByListId[list.itemId] ?? []
      list.activities.forEach(activity => {
        activity.tasks = tasksByActivityId[activity.itemId] ?? []
      })
    })
    return project
  }
}

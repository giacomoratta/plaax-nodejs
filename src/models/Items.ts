export interface GenericItem {
  projectId: number
  itemId: number
  ownerUserId: number
  assignedUserIds: number[]
  title: string
  createTs: number
  updateTs: number
  archivedTs: number | null
}

export interface ProjectItem extends GenericItem {}

export interface ListItem extends GenericItem {}

export interface ActivityItem extends GenericItem {
  listId: number
}

export interface TaskItem extends GenericItem {
  listId: number
  activityId: number
}

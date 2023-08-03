import { type ProjectItem, type ListItem, type ActivityItem, type TaskItem } from './Item'

export interface ActivityExpanded extends ActivityItem {
  tasks: TaskItem[]
}

export interface ListExpanded extends ListItem {
  activities: ActivityExpanded[]
}

export interface ProjectExpanded extends ProjectItem {
  lists: ListExpanded[]
}

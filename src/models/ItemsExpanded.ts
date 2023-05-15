import { ProjectItem, ListItem, ActivityItem, TaskItem } from './Items'

export interface ProjectExpanded extends ProjectItem {
  lists: ListExpanded[]
}

export interface ListExpanded extends ListItem {
  activities: ActivityExpanded[]
}

export interface ActivityExpanded extends ActivityItem {
  tasks: TaskItem[]
}

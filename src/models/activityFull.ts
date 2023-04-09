import { ActivityItem } from './activityItem'
import { TaskItem } from './taskItem'

export interface ActivityFull extends ActivityItem {
  tasks: TaskItem[]
}

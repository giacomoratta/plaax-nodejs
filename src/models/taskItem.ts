import { BoardItem } from './boardItem'

export interface TaskItem extends BoardItem {
  listId: number
  activityId: number
}

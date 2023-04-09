import { ListItem } from './listItem'
import { ActivityFull } from './activityFull'

export interface ListFull extends ListItem {
  activities: ActivityFull[]
}

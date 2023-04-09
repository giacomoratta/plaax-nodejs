import { ProjectItem } from './projectItem'
import { ListFull } from './listFull'

export interface ProjectFull extends ProjectItem {
  lists: ListFull[]
}

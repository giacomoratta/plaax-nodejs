export interface BoardItem {
  projectId: number
  itemId: number
  ownerUserId: number
  assignedUserIds: number[]
  title: string
  createTs: number
  updateTs: number
  archivedTs: number | null
}

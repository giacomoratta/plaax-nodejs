import { AttributeValue } from '@aws-sdk/client-dynamodb'

export interface ddbItemPrimaryKey extends Record<string, AttributeValue> {
  projectId: AttributeValue.NMember
  itemId: AttributeValue.NMember
}

export interface ddbGenericItem extends Record<string, AttributeValue> {
  projectId: AttributeValue.NMember
  itemId: AttributeValue.NMember
  ownerUserId: AttributeValue.NMember
  assignedUserIds: AttributeValue.NSMember
  title: AttributeValue.SMember
  createTs: AttributeValue.NMember
  updateTs: AttributeValue.NMember
  archivedTs: AttributeValue.NMember
}

export interface ddbProjectItem extends ddbGenericItem {}

export interface ddbListItem extends ddbGenericItem {}

export interface ddbActivityItem extends ddbGenericItem {
  listId: AttributeValue.NMember
}

export interface ddbTaskItem extends ddbGenericItem {
  listId: AttributeValue.NMember
  activityId: AttributeValue.NMember
}

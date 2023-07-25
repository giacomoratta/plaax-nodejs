/* move inside __tests__, set jest to skip any non "test.ts" file */

import { type ProjectExpanded, type ListExpanded, type ActivityExpanded } from '../../models/ItemExpanded'
import { type TaskItem } from '../../models/Item'

// todo: temp function, the translation should be returned by repo
export const jsonToProjectExpanded = (jsonData): ProjectExpanded => {
  return {
    projectId: jsonData.projectId,
    itemId: jsonData.itemId,
    ownerUserId: jsonData.ownerUserId,
    assignedUserIds: jsonData.assignedUserIds,
    title: jsonData.title,
    createTs: jsonData.createTs,
    updateTs: jsonData.updateTs,
    archivedTs: jsonData.archivedTs ?? null,
    lists: ((jsonData.lists === undefined ? [] : jsonData.lists)).map((jsonList): ListExpanded => {
      return {
        projectId: jsonList.projectId,
        itemId: jsonList.itemId,
        ownerUserId: jsonList.ownerUserId,
        assignedUserIds: jsonList.assignedUserIds,
        title: jsonList.title,
        createTs: jsonList.createTs,
        updateTs: jsonList.updateTs,
        archivedTs: jsonList.archivedTs ?? null,
        activities: ((jsonList.activities === undefined ? [] : jsonList.activities)).map((jsonActivity): ActivityExpanded => {
          return {
            projectId: jsonActivity.projectId,
            itemId: jsonActivity.itemId,
            ownerUserId: jsonActivity.ownerUserId,
            assignedUserIds: jsonActivity.assignedUserIds,
            title: jsonActivity.title,
            createTs: jsonActivity.createTs,
            updateTs: jsonActivity.updateTs,
            archivedTs: jsonActivity.archivedTs ?? null,
            listId: jsonList.itemId,
            tasks: ((jsonActivity.tasks === undefined ? [] : jsonActivity.tasks)).map((jsonTask): TaskItem => {
              return {
                projectId: jsonTask.projectId,
                itemId: jsonTask.itemId,
                ownerUserId: jsonTask.ownerUserId,
                assignedUserIds: jsonTask.assignedUserIds,
                title: jsonTask.title,
                createTs: jsonTask.createTs,
                updateTs: jsonTask.updateTs,
                archivedTs: jsonTask.archivedTs ?? null,
                listId: jsonList.itemId,
                activityId: jsonActivity.itemId
              }
            })
          }
        })
      }
    })
  }
}

const path = require('path')
const fs = require('fs')

const FILES_GENERATION_ENABLED = true

const { readJsonDataFromFile, randomTimestamp, writeArrayItemsToFiles } = require('./utils')

const currentDir = path.dirname(process.argv[1])
const jsonFilePath = path.join('..','json-initial-data','plaax-example-data-env.json')

const destDirPlaaxApiData = path.resolve(path.join(currentDir,'..','json-final-data','plaax-api-data'))
// const destDirPlaaxUserProjects = path.resolve(path.join(currentDir,'..','json-final-data','plaax-user-project'))
// const destDirPlaaxUserCalendar = path.resolve(path.join(currentDir,'..','json-final-data','plaax-user-calendar'))

const jsonData = readJsonDataFromFile(jsonFilePath)

// Final data for DynamoDb
const plaaxItemsBoardArray = []
const plaaxUserProjectsArray = []
const plaaxUserCalendarArray = []

const addUserCalendarRecords = (userId, item) => {
  if (item['calByUser']) {
    Object.keys(item['calByUser']).forEach(kUserId => {
      plaaxUserCalendarArray.push(convertItemToDynamoDbItem({
        "userId": parseInt(kUserId),
        "itemId": item.itemId,
        "beginTs": (new Date(item['calByUser'][kUserId]['calBeginStringDate'])).getTime(),
        "endTs": (new Date(item['calByUser'][kUserId]['calEndStringDate'])).getTime()
      }))
    })
    return
  }

  if (item['calBeginStringDate'] && item['calEndStringDate']) {
    plaaxUserCalendarArray.push(convertItemToDynamoDbItem({
      "userId": userId,
      "itemId": item.itemId,
      "beginTs": (new Date(item['calBeginStringDate'])).getTime(),
      "endTs": (new Date(item['calEndStringDate'])).getTime()
    }))
  }
}

jsonData.forEach(project => {
  const projectApiData = {
    "projectId": project.projectId,
    "itemId": project.projectId,
    "ownerUserId": project.ownerUserId,
    "assignedUserIds": project.assignedUserIds || [project.ownerUserId],
    // "listId": null,
    // "activityId": null,
    "title": `Project ${project.projectId}`,
    "createTs": randomTimestamp(),
    "updateTs": randomTimestamp(2),
    "archivedTs": null,
    "lists": []
  }
  plaaxItemsBoardArray.push(projectApiData)

  // plaaxUserProjectsArray.push(convertItemToDynamoDbItem({
  //   "userId": project.ownerUserId,
  //   "projectId": project.projectId,
  // }))
  //
  // if (project.assignedUserIds && project.assignedUserIds.length > 0) {
  //   project.assignedUserIds.forEach((userId) => {
  //     plaaxUserProjectsArray.push(convertItemToDynamoDbItem({
  //       "userId": userId,
  //       "projectId": project.projectId,
  //     }))
  //   })
  // }

  project['lists'].forEach(list => {
    const listApiData = {
      "projectId": project.projectId,
      "itemId": list.itemId,
      "ownerUserId": list.ownerUserId || project.ownerUserId,
      "assignedUserIds": list.assignedUserIds || [project.ownerUserId],
      // "listId": null,
      // "activityId": null,
      "title": `List ${list.itemId} for ${project.projectId}`,
      "createTs": randomTimestamp(),
      "updateTs": randomTimestamp(2),
      "archivedTs": null,
      // "lists": [],
      "activities": []
    }
    projectApiData.lists.push(listApiData)

    list['activities'].forEach(activity => {
      const activityApiData = {
        "projectId": project.projectId,
        "itemId": activity.itemId,
        "ownerUserId": activity.ownerUserId || project.ownerUserId,
        "assignedUserIds": activity.assignedUserIds || [project.ownerUserId],
        "listId": list.itemId,
        // "activityId": null,
        "title": `Activity ${activity.itemId} for ${project.projectId}`,
        "createTs": randomTimestamp(),
        "updateTs": randomTimestamp(2),
        "archivedTs": null,
        // "lists": [],
        // "activities": [],
        "tasks": []
      }
      listApiData.activities.push(activityApiData)

      // addUserCalendarRecords(activity.ownerUserId || project.ownerUserId, activity)

      activity['tasks'].forEach(task => {
        const taskApiData = {
          "projectId": project.projectId,
          "itemId": task.itemId,
          "ownerUserId": task.ownerUserId || project.ownerUserId,
          "assignedUserIds": task.assignedUserIds || [project.ownerUserId],
          "listId": list.itemId,
          "activityId": activity.itemId,
          "title": `Task ${task.itemId} for ${project.projectId}`,
          "createTs": randomTimestamp(),
          "updateTs": randomTimestamp(2),
          "archivedTs": null,
          // "lists": [],
          // "activities": [],
          // "tasks": []
        }
        activityApiData.tasks.push(taskApiData)

        // addUserCalendarRecords(task.ownerUserId || project.ownerUserId, task)
      })
    })
  })
})

if (FILES_GENERATION_ENABLED === true) {
  console.log('Writing plaax items...')
  writeArrayItemsToFiles(destDirPlaaxApiData, plaaxItemsBoardArray, (item) => {
    return 'project-' + item.itemId + '-full-board-api'
  })
}

// if (FILES_GENERATION_ENABLED === true) {
//   console.log('Writing plaax user project...')
//   writeExampleDataFiles(destDirPlaaxUserProjects, plaaxUserProjectsArray, (item) => {
//     return 'uprel-u' + item.userId.N + '-p' + item.projectId.N
//   })
// }
//
// if (FILES_GENERATION_ENABLED === true) {
//   console.log('Writing plaax user calendar...')
//   writeExampleDataFiles(destDirPlaaxUserCalendar, plaaxUserCalendarArray, (item) => {
//     return 'uCal-u' + item.userId.N + '-i' + item.itemId.N
//   })
// }

console.log("\n\n")
console.log('Plaax projects in the board:', plaaxItemsBoardArray.length)
console.log('Plaax user project:', plaaxUserProjectsArray.length)
console.log('Plaax user calendar:', plaaxUserCalendarArray.length)

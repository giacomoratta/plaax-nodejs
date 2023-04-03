const path = require('path')
const fs = require('fs')

const FILES_GENERATION_ENABLED = true

const { convertItemToDynamoDbItem } = require('./utils')

const currentDir = path.dirname(process.argv[1])
const jsonFilePath = path.join('..','json-initial-data','plaax-example-data-env.json')

const destDirPlaaxItems = path.resolve(path.join(currentDir,'..','json-final-data','plaax-items'))
const destDirPlaaxUserProjects = path.resolve(path.join(currentDir,'..','json-final-data','plaax-user-project'))
const destDirPlaaxUserCalendar = path.resolve(path.join(currentDir,'..','json-final-data','plaax-user-calendar'))

let jsonData = []
try {
  jsonData = require(jsonFilePath)
} catch (e) {
  console.error('Cannot open file ', jsonFilePath)
  process.exit()
}

const randomTimestamp = (daysForward) => {
  return Date.now() + (daysForward || 0) * (24*60*60*1000)
}

const writeExampleDataFiles = (destDirPlaaxItems, plaaxItemsArray, filenameFn) => {
  if (!fs.existsSync(destDirPlaaxItems)) fs.mkdirSync(destDirPlaaxItems)
  plaaxItemsArray.forEach((item, index) => {
    console.log(item)
    fs.writeFileSync(path.join(destDirPlaaxItems,filenameFn(item) + '-db.json'),
        JSON.stringify(item, null, 2)
    )
  })
}

// Final data for DynamoDb
const plaaxItemsArray = []
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
  plaaxItemsArray.push(convertItemToDynamoDbItem({
    "projectId": project.projectId,
    "itemId": project.projectId,
    "ownerUserId": project.ownerUserId,
    "assignedUserIds": project.assignedUserIds || [project.ownerUserId],
    "listId": null,
    "activityId": null,
    "title": `Project ${project.projectId}`,
    "createTs": randomTimestamp(),
    "updateTs": randomTimestamp(2)
  }))

  plaaxUserProjectsArray.push(convertItemToDynamoDbItem({
    "userId": project.ownerUserId,
    "projectId": project.projectId,
  }))

  if (project.assignedUserIds && project.assignedUserIds.length > 0) {
    project.assignedUserIds.forEach((userId) => {
      plaaxUserProjectsArray.push(convertItemToDynamoDbItem({
        "userId": userId,
        "projectId": project.projectId,
      }))
    })
  }

  project['lists'].forEach(list => {
    plaaxItemsArray.push(convertItemToDynamoDbItem({
      "projectId": project.projectId,
      "itemId": list.itemId,
      "ownerUserId": list.ownerUserId || project.ownerUserId,
      "assignedUserIds": list.assignedUserIds || [project.ownerUserId],
      "listId": null,
      "activityId": null,
      "title": `List ${list.itemId} for ${project.projectId}`,
      "createTs": randomTimestamp(),
      "updateTs": randomTimestamp(2)
    }))

    list['activities'].forEach(activity => {
      plaaxItemsArray.push(convertItemToDynamoDbItem({
        "projectId": project.projectId,
        "itemId": activity.itemId,
        "ownerUserId": activity.ownerUserId || project.ownerUserId,
        "assignedUserIds": activity.assignedUserIds || [project.ownerUserId],
        "listId": list.itemId,
        "activityId": null,
        "title": `Activity ${activity.itemId} for ${project.projectId}`,
        "createTs": randomTimestamp(),
        "updateTs": randomTimestamp(2)
      }))

      addUserCalendarRecords(activity.ownerUserId || project.ownerUserId, activity)

      activity['tasks'].forEach(task => {
        plaaxItemsArray.push(convertItemToDynamoDbItem({
          "projectId": project.projectId,
          "itemId": task.itemId,
          "ownerUserId": task.ownerUserId || project.ownerUserId,
          "assignedUserIds": task.assignedUserIds || [project.ownerUserId],
          "listId": list.itemId,
          "activityId": activity.itemId,
          "title": `Task ${task.itemId} for ${project.projectId}`,
          "createTs": randomTimestamp(),
          "updateTs": randomTimestamp(2)
        }))

        addUserCalendarRecords(task.ownerUserId || project.ownerUserId, task)
      })
    })
  })
})

if (FILES_GENERATION_ENABLED === true) {
  console.log('Writing plaax items...')
  writeExampleDataFiles(destDirPlaaxItems, plaaxItemsArray, (item) => {
    return 'item-i' + item.itemId.N + '-p' + item.projectId.N
  })
}

if (FILES_GENERATION_ENABLED === true) {
  console.log('Writing plaax user project...')
  writeExampleDataFiles(destDirPlaaxUserProjects, plaaxUserProjectsArray, (item) => {
    return 'uprel-u' + item.userId.N + '-p' + item.projectId.N
  })
}

if (FILES_GENERATION_ENABLED === true) {
  console.log('Writing plaax user calendar...')
  writeExampleDataFiles(destDirPlaaxUserCalendar, plaaxUserCalendarArray, (item) => {
    return 'uCal-u' + item.userId.N + '-i' + item.itemId.N
  })
}

console.log("\n\n")
console.log('Plaax items:', plaaxItemsArray.length)
console.log('Plaax user project:', plaaxUserProjectsArray.length)
console.log('Plaax user calendar:', plaaxUserCalendarArray.length)

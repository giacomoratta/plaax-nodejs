/**
 * Generate the data that DynamoDB should accept or return
 * from the directory "/table-definitions".
 */

const path = require('path')
const fs = require('fs')

const { convertItemToDynamoDbItem } = require('../../../utils/utils')

const jsonFileName = process.argv[2]

if (!jsonFileName) {
  console.warn('No JSON file specified.')
  process.exit()
}

const currentDir = path.dirname(process.argv[1])
// const jsonFile = path.join(currentDir, jsonFileName)

let jsonData = null

try {
  jsonData = require('../table-definitions/' + jsonFileName)
} catch (e) {
  console.error('Cannot open file ', jsonFileName)
  process.exit()
}

const jsonDataForDynamoDb = []

jsonData.forEach((item) => {
  jsonDataForDynamoDb.push(convertItemToDynamoDbItem(item))
})

const jsonFileMetaData = path.parse(jsonFileName)

// Write single files with arrays
// fs.writeFileSync(path.join(currentDir, jsonFileMetaData.name + '-db.json'), JSON.stringify(jsonDataForDynamoDb, null, 2))

// Write items in single files
jsonDataForDynamoDb.forEach((item, index) => {
  fs.writeFileSync(path.join(currentDir, jsonFileMetaData.name + '-db-' + index +'.json'), JSON.stringify(item, null, 2))
})

const fs = require("fs");
const path = require("path");

const convertItemToDynamoDbItem = (item) => {
  const keys = Object.keys(item)
  const newItem = {}
  keys.forEach(k => {
    if (typeof item[k] === 'string') newItem[k] = { S: item[k].toString() }
    else if (typeof item[k] === 'number') newItem[k] = { N: item[k].toString() }
    else if (item[k] === null) {}
    else if (Array.isArray(item[k]) && typeof item[k][0] === 'number') newItem[k] = { NS: item[k].map(e => e.toString()) }
    else {
      console.error('Unknown item data type for ' + k + ': ', item[k], 'as', typeof item[k])
      process.exit()
    }
  })
  return newItem
}

const readJsonDataFromFile = (jsonFilePath, exitOnError = true) => {
  try {
    return require(jsonFilePath)
  } catch (e) {
    console.error('Cannot open file ', jsonFilePath)
    if (exitOnError === true) process.exit()
    return false
  }
}

const randomTimestamp = (daysForward) => {
  return Date.now() + (daysForward || 0) * (24*60*60*1000)
}

const writeArrayItemsToFiles = (destDirPlaaxItems, plaaxItemsArray, filenameFn) => {
  if (!fs.existsSync(destDirPlaaxItems)) fs.mkdirSync(destDirPlaaxItems)
  plaaxItemsArray.forEach((item, index) => {
    console.log(item)
    fs.writeFileSync(path.join(destDirPlaaxItems,filenameFn(item) + '.json'),
      JSON.stringify(item, null, 2)
    )
  })
}

module.exports = {
  convertItemToDynamoDbItem,
  readJsonDataFromFile,
  randomTimestamp,
  writeArrayItemsToFiles
}
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

module.exports = {
    convertItemToDynamoDbItem
}
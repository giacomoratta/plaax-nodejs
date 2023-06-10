const { getLocalConfig } = require('./aws-sdk3-local-config');
const { DynamoDBClient, ListTablesCommand, QueryCommand, GetItemCommand, BatchGetItemCommand } = require("@aws-sdk/client-dynamodb");
const fs = require('fs');
const path = require('path');

const ddbClient = new DynamoDBClient({
  ...getLocalConfig()
});

const runDbCommand = async (command, processFn) => {
  try {
    const results = await ddbClient.send(command);
    if (processFn) processFn(results);
    else console.log(results);
    fs.writeFileSync(path.join(__dirname, '__results.json'),
      JSON.stringify(results, null, 2)
    )
  } catch (err) {
    console.error('ERROR in runDbCommand:\n', err);
  }
}

const ddbFunctions = {
  listAllTables: async () => {
    const command = new ListTablesCommand({});
    await runDbCommand(command, (results) => {
      console.log(results.TableNames.join("\n"));
    });
  },
  getAllUserProjects: async (userId = "1005") => {
    const command = new QueryCommand({
      TableName: "plaax-dev-user-project",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {":userId":{"N":userId}}
    });
    await runDbCommand(command, (results) => {
      console.log(results.Items);
      console.log("\nItems count:", results.Count);
    });
  },
  getAllProjectItems: async (projectId = "1002") => {
    const command = new QueryCommand({
      TableName: "plaax-dev-items",
      KeyConditionExpression: "projectId = :projectId",
      ExpressionAttributeValues: {":projectId":{"N":projectId}}
    });
    await runDbCommand(command, (results) => {
      console.log(results.Items);
      console.log("\nItems count:", results.Count);
    });
  },
  getOneItem: async (projectId = "1002", itemId = "1171") => {
    const command = new GetItemCommand({
      TableName: "plaax-dev-items",
      Key: {"projectId":{"N":projectId},"itemId":{"N":itemId}}
    });
    await runDbCommand(command, (results) => {
      console.log(results.Item);
    });
  },
  getUserCalendarByInterval: async (
    userId = "1006",
    beginTs = "1680028200000",
    endTs = "1680106500000"
  ) => {
    const command = new QueryCommand({
      TableName: "plaax-dev-user-calendar",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "beginTs >= :beginTs AND endTs <= :endTs",
      ExpressionAttributeValues: {":userId":{"N":userId},":beginTs":{"N":beginTs},":endTs":{"N":endTs}}
    });
    await runDbCommand(command, (results) => {
      console.log(results.Items);
      console.log("\nItems count:", results.Count);
    });
  },
  getProjectsById: async (projectIds = ["1002","1003"]) => {
    const command = new BatchGetItemCommand({
      RequestItems: {
        "plaax-dev-items": {
          // Each entry in Keys is an object that specifies a primary key.
          Keys: [
            {
              "projectId": {
                N: "1001"
              },
              "itemId": {
                N: "1001"
              }
            },
            {
              "projectId": {
                N: "1002"
              },
              "itemId": {
                N: "1002"
              }
            },
          ],
          // ProjectionExpression: "projectId",
        },
      },
    }
    // {
    //   TableName: "plaax-dev-items",
    //   KeyConditionExpression: "projectId = :projectId",
    //   ExpressionAttributeValues: {":projectId":{"N":projectId}}
    // }
    );
    await runDbCommand(command, (results) => {
      console.log(results.Responses['plaax-dev-items']);
      // console.log("\nItems count:", results.Count);
    });
  },
}

// const defaultFunctionName = "getUserCalendarByInterval"
const defaultFunctionName = Object.keys(ddbFunctions).slice(-1)
const selectedFunctionName = process.argv[2] || defaultFunctionName

const listAllFunctions = () => {
  console.log(
    "\nAVAILABLE FUNCTIONS:\n-",
    Object.keys(ddbFunctions).join("\n- ")
  )
}

listAllFunctions();

if (!ddbFunctions[selectedFunctionName]) {
  process.exit();
}

console.log("\n\n\nSELECTED FUNCTION: '" + selectedFunctionName + "'\n");
ddbFunctions[selectedFunctionName]();
// src/services/itemService.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
// const sessionToken = process.env.AWS_SESSION_TOKEN; // Optional

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing required AWS environment variables");
}

const ddbClient = new DynamoDBClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    // sessionToken: sessionToken
  }
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Use the DynamoDB table name from the environment variable
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Items';

// export async function getItems() {
//   const command = new ScanCommand({ TableName: TABLE_NAME });
//   const result = await ddbDocClient.send(command);
//   return result.Items;
// }

export async function getItems(limit: number = 10) {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const result = await ddbDocClient.send(command);

  // Sort descending by `causeVotes` and take top `limit`
  const sortedItems = (result.Items || [])
    .sort((a, b) => (b.causeVotes || 0) - (a.causeVotes || 0))
    .slice(0, limit);

  return sortedItems;
}


export async function getItem(id: number) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  const result = await ddbDocClient.send(command);
  return result.Item;
}

export async function createItem(item: any) {
  // Ensure the item has a unique id
  if (!item.id) {
    // item.id = Date.now().toString();
    item.id = Date.now();
  }
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });
  await ddbDocClient.send(command);
  return item;
}

export async function updateItem(id: number, updates: any) {
  const existing = await getItem(id);
  if (!existing) {
    throw new Error('Item not found');
  }
  const updatedItem = { ...existing, ...updates, id };
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: updatedItem,
  });
  await ddbDocClient.send(command);
  return updatedItem;
}

export async function deleteItem(id: number) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  await ddbDocClient.send(command);
}

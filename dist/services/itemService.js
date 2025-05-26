"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = getItems;
exports.getItem = getItem;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
// src/services/itemService.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const sessionToken = process.env.AWS_SESSION_TOKEN; // Optional
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing required AWS environment variables");
}
const ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        // sessionToken: sessionToken
    }
});
const ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient);
// Use the DynamoDB table name from the environment variable
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Items';
// export async function getItems() {
//   const command = new ScanCommand({ TableName: TABLE_NAME });
//   const result = await ddbDocClient.send(command);
//   return result.Items;
// }
function getItems() {
    return __awaiter(this, arguments, void 0, function* (limit = 10) {
        const command = new lib_dynamodb_1.ScanCommand({ TableName: TABLE_NAME });
        const result = yield ddbDocClient.send(command);
        // Sort descending by `causeVotes` and take top `limit`
        const sortedItems = (result.Items || [])
            .sort((a, b) => (b.causeVotes || 0) - (a.causeVotes || 0))
            .slice(0, limit);
        return sortedItems;
    });
}
function getItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: { id },
        });
        const result = yield ddbDocClient.send(command);
        return result.Item;
    });
}
function createItem(item) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the item has a unique id
        if (!item.id) {
            // item.id = Date.now().toString();
            item.id = Date.now();
        }
        const command = new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        });
        yield ddbDocClient.send(command);
        return item;
    });
}
function updateItem(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield getItem(id);
        if (!existing) {
            throw new Error('Item not found');
        }
        const updatedItem = Object.assign(Object.assign(Object.assign({}, existing), updates), { id });
        const command = new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: updatedItem,
        });
        yield ddbDocClient.send(command);
        return updatedItem;
    });
}
function deleteItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new lib_dynamodb_1.DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id },
        });
        yield ddbDocClient.send(command);
    });
}

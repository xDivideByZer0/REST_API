"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const items_1 = __importDefault(require("./routes/items"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
// Mount your routes
app.use('/api/items', items_1.default);
// Health-check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`AWS Region: ${process.env.AWS_REGION}`);
    console.log(`DynamoDB Table: ${process.env.DYNAMODB_TABLE}`);
});

import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import itemsRouter from './routes/items';

console.log('Loaded AWS_REGION:', process.env.AWS_REGION);

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Mount your routes
app.use('/api/items', itemsRouter);

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`AWS Region: ${process.env.AWS_REGION}`);
  console.log(`DynamoDB Table: ${process.env.DYNAMODB_TABLE}`);
});

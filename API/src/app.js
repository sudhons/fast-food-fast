import express from 'express';
import bodyParser from 'body-parser';

import orders from './routes/ordersRoute';
import createTables from './queries/createTables';

createTables();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', orders);

app.use((request, response) => {
  response.status(404);
  return response.json({ status: 404, message: 'unknown url path' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;

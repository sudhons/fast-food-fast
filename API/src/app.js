import express from 'express';
import bodyParser from 'body-parser';

import orders from './routes/ordersRoute';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', orders);

app.use((request, response, next) => {
  const error = new Error('unknown url path');
  error.status = 404;
  return next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  const status = error.status || 400;
  response.status(status);
  return response.json({ status, message: error.message });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

export default app;

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import swaggerDocument from '../../swagger.json';

import userRouter from './routes/userRouter';
import menuRouter from './routes/menuRouter';

import createTables from './queries/createTables';
import orderRouter from './routes/orderRouter';
import userOrderRouter from './routes/userOrderRouter';

createTables();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, '../../CLIENT')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', orderRouter);
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/users', userOrderRouter);

app.use((request, response) => {
  response.status(404);
  return response.json({ status: 404, message: 'unknown url path' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;

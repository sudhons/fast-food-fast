import express from 'express';

const router = express.Router();

router.get('/', (request, response) => {
  response.status(200);
  return response.json({ status: 200, message: 'Welcome to fast food fast' });
});

export default router;

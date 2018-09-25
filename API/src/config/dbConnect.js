import { Client } from 'pg';

const dbConnect = new Client(process.env.DATABASE_URL);

dbConnect.connect();

export default dbConnect;

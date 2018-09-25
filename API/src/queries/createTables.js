import dbConnect from '../config/dbConnect';

const query = `
  DO $$ BEGIN
    CREATE TYPE role AS ENUM('customer', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE status AS ENUM('new', 'processing', 'cancelled', 'complete');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    user_role role NOT NULL DEFAULT 'customer',
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menu (
    menu_id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(50) NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY NOT NULL,
    menu_id INTEGER REFERENCES menu(menu_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    sales_status status NOT NULL DEFAULT 'new',
    ordered_time TIMESTAMP NOT NULL DEFAULT NOW(),
    unit_price NUMERIC NOT NULL,
    total NUMERIC NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_address VARCHAR(200) NOT NULL,
    recipient_phone INTEGER NOT NULL,
    total_amount NUMERIC NOT NULL,
    order_status status DEFAULT 'new',
    ordered_time TIMESTAMP NOT NULL DEFAULT NOW(),
    accepted_time TIMESTAMP DEFAULT NULL,
    declined_time TIMESTAMP DEFAULT NULL,
    completed_time TIMESTAMP DEFAULT NULL,
    shopping_cart integer []
  );
`;

const createTables = () => dbConnect.query(query);

export default createTables;

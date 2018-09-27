import bcrypt from 'bcryptjs';

import dbConnect from '../config/dbConnect';

const query = `
  DO $$ BEGIN
    CREATE TYPE role AS ENUM('customer', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE status AS ENUM('new', 'processing', 'cancelled', 'completed');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE category AS ENUM('meal', 'drink', 'dessert');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    user_role role NOT NULL DEFAULT 'customer',
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );

  INSERT INTO users(first_name, last_name, email, password, user_role)
    VALUES(
      'oluwaseun', 'sunday', 'sudhons@yahoo.com',
      '${bcrypt.hashSync('sudhons', 10)}', 'admin'
    )
    ON CONFLICT (email) DO NOTHING;

  CREATE TABLE IF NOT EXISTS menu (
    menu_id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL NOT NULL,
    image TEXT NOT NULL,
    menu_category category NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_name VARCHAR(80) NOT NULL,
    recipient_address VARCHAR(120) NOT NULL,
    recipient_phone INTEGER NOT NULL,
    total_amount DECIMAL NOT NULL,
    order_status status DEFAULT 'new',
    ordered_time TIMESTAMP NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY NOT NULL,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    title VARCHAR(50) REFERENCES menu(title) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    sales_status status NOT NULL DEFAULT 'new',
    ordered_time TIMESTAMP NOT NULL DEFAULT NOW(),
    unit_price DECIMAL NOT NULL,
    total DECIMAL NOT NULL
  );
`;

const createTables = () => dbConnect.query(query);

export default createTables;

-- DealX-SWE Database Initialization Script
-- This script creates the necessary tables based on the Sequelize models found.
-- WARNING: Assumptions have been made based on model definitions. Review and adjust as necessary.

-- Drop existing tables (optional, useful for development/testing)
-- DROP TABLE IF EXISTS cart_items CASCADE;
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS rewards CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TYPE IF EXISTS user_type;

-- Create ENUM type for user roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('admin', 'user');
    END IF;
END$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email TEXT UNIQUE, -- Using TEXT as length was specified as TEXT(100)
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    address TEXT,
    phone_number VARCHAR(15),
    type user_type, -- Use the created ENUM type
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Add timestamp columns
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- Using TEXT as VARCHAR length wasn't specified
    description TEXT NOT NULL, -- Using TEXT as VARCHAR length wasn't specified
    price NUMERIC(10, 2) NOT NULL, -- Using NUMERIC for currency
    image_url TEXT NOT NULL, -- Using TEXT as VARCHAR length wasn't specified
    -- Using TIMESTAMPTZ for created_at and updated_at as it's standard practice
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rewards table (assuming standard Sequelize naming and timestamps)
CREATE TABLE IF NOT EXISTS "Rewards" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Assuming VARCHAR(255) if not specified
    points_required INTEGER NOT NULL,
    description TEXT, -- Using TEXT as VARCHAR length wasn't specified
    expiry_date DATE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create transactions table (assuming standard Sequelize naming and timestamps)
CREATE TABLE IF NOT EXISTS "Transactions" (
    id SERIAL PRIMARY KEY,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    description TEXT, -- Using TEXT as VARCHAR length wasn't specified
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE, -- Foreign key to users
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cart_items table
-- Assumption: 'cart_id' in the model likely refers to 'user_id'.
-- Assumption: 'product_id' should be an INTEGER referencing the products table.
CREATE TABLE IF NOT EXISTS cart_items (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMPTZ DEFAULT NOW(), -- Add timestamp
    PRIMARY KEY (user_id, product_id) -- Composite primary key
);

-- Add indexes for frequently queried columns (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON "Transactions"(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Add trigger function to update 'updated_at' timestamp (optional, application might handle this)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables (example for 'users' and 'products')
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    -- Add similar triggers for Rewards and Transactions if needed
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rewards_updated_at') THEN
        CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON "Rewards" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_transactions_updated_at') THEN
        CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON "Transactions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END$$;


-- Note: The 'Customer' model seems redundant with 'users' and was not included.
-- Note: The 'adminstrator' model was commented out in the source and was not included.

COMMIT;


-- =================================================================
-- Bellat Digital Platform - Prototype SQL Schema
--
-- This schema is designed for a production version of the platform,
-- based on the data models specified in the prototype documentation.
--
-- Database System: PostgreSQL (recommended for its JSONB support)
-- Version: 1.0
-- Date: January 2026
-- =================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- ENUM Types
-- For controlled vocabularies, improving data integrity.
-- =================================================================

CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');

-- =================================================================
-- Categories Table
-- Stores product categories.
-- =================================================================

CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'kachir', 'rotis'
    name_fr VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    icon VARCHAR(10), -- For emoji or icon identifier
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================================================================
-- Products Table
-- Stores all product information.
-- =================================================================

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'prod_001'
    name_fr VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_fr TEXT,
    description_ar TEXT,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL, -- Price in DZD
    unit VARCHAR(50), -- e.g., '500g', '400g'
    stock_status stock_status NOT NULL DEFAULT 'in_stock',
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- To toggle product visibility
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups by category
CREATE INDEX idx_products_category_id ON products(category_id);

-- =================================================================
-- Users Table
-- Stores customer and administrator accounts.
-- =================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster login
CREATE INDEX idx_users_email ON users(email);

-- =================================================================
-- Addresses Table
-- Stores delivery addresses associated with users.
-- =================================================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    wilaya VARCHAR(100) NOT NULL,
    commune VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster address lookups by user
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- =================================================================
-- Orders Table
-- Stores order information.
-- =================================================================

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'BLT-20260104-00001'
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'pending',
    
    -- Order totals
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    -- Delivery details are stored in a structured JSONB object.
    -- This avoids creating many columns for a one-off address and is flexible.
    -- For a more normalized approach, an address_id could be used to link to the addresses table.
    delivery_address JSONB NOT NULL,
    
    delivery_slot_date DATE NOT NULL,
    delivery_slot_time VARCHAR(100) NOT NULL, -- e.g., 'Matin (8h - 12h)'
    
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash_on_delivery',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for querying orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =================================================================
-- Order Items Table
-- Junction table between Orders and Products.
-- =================================================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    
    -- Records the price at the time of purchase to protect against future price changes
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    
    UNIQUE (order_id, product_id) -- A product can only appear once per order
);

-- Indexes for joining tables
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =================================================================
-- Triggers for automatically updating `updated_at` timestamps.
-- =================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with an `updated_at` column
CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_addresses BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- =================================================================
-- End of Schema
-- =================================================================

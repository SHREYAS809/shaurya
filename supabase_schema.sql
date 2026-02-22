-- Sri Shaurya Medicals - Supabase Schema Migration

-- 0. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create Medicines Table
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    description TEXT,
    requires_prescription BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Create Addresses Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Create Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'New', -- New, Accepted, Ready, Dispatched, Completed
    phone TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Create Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    medicine_id INTEGER REFERENCES medicines(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- Enable RLS (Row Level Security) - Optional but recommended
-- ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read-only access to medicines" ON medicines FOR SELECT USING (true);

-- 6. Seed Initial Data
INSERT INTO categories (name, icon) VALUES
('Pain Relief', '💊'),
('Cold & Cough', '🤧'),
('Vitamins', '🥗'),
('Skin Care', '🧴'),
('Digestion', '🍎'),
('Sleep Aid', '😴');

-- Seed Medicines (Example data)
INSERT INTO medicines (name, category_id, price, original_price, rating, reviews, description, requires_prescription, stock, image_url) VALUES
('Aspirin 500mg', 1, 45.00, 60.00, 4.5, 128, 'Effective pain reliever and fever reducer', false, 50, 'https://images.unsplash.com/photo-1585193566519-cd4628902d4a'),
('Ibuprofen 400mg', 1, 65.00, 85.00, 4.7, 245, 'Anti-inflammatory pain reliever', false, 40, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b'),
('Paracetamol 250mg', 1, 35.00, 50.00, 4.6, 312, 'Safe and effective fever and pain relief', false, 75, 'https://images.unsplash.com/photo-1584308666744-24d5f400f6f0'),
('Diclofenac 50mg', 1, 85.00, 110.00, 4.4, 89, 'Powerful anti-inflammatory pain relief', true, 25, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b'),
('Cough Syrup 100ml', 2, 120.00, 150.00, 4.3, 167, 'Soothing cough reliever with honey', false, 35, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b'),
('Vitamin C 500mg', 3, 150.00, 200.00, 4.6, 289, 'Boost immunity with Vitamin C', false, 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1');

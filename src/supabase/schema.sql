-- ============================================================
-- SCHEMA JEANCOL - SECURE & OPTIMIZED
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL UNIQUE,
    image       TEXT        NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    price           NUMERIC     NOT NULL CHECK (price >= 0),
    category        TEXT        NOT NULL,
    image           TEXT        NOT NULL,
    images          TEXT[],
    video           TEXT,
    discount        TEXT,
    old_price       NUMERIC,
    offer_price     NUMERIC,
    offer_end_date  TIMESTAMPTZ,
    description     TEXT,
    features        JSONB,
    sizes           TEXT[],
    colors          JSONB,
    variations      JSONB,
    stock           INTEGER     DEFAULT 0 CHECK (stock >= 0),
    rating          NUMERIC     DEFAULT 0,
    reviews_count   INTEGER     DEFAULT 0,
    is_new          BOOLEAN     DEFAULT false,
    is_trending     BOOLEAN     DEFAULT false,
    size_guide_type TEXT,
    weight          TEXT,
    dimensions      TEXT,
    material        TEXT,
    brand           TEXT,
    sku             TEXT        UNIQUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID        REFERENCES auth.users(id), -- Linked to Auth User
    customer       TEXT        NOT NULL,
    email          TEXT        NOT NULL,
    phone          TEXT        NOT NULL,
    address        TEXT        NOT NULL,
    city           TEXT        NOT NULL,
    department     TEXT        NOT NULL,
    subtotal       NUMERIC     NOT NULL,
    shipping       NUMERIC     DEFAULT 0,
    discount       NUMERIC     DEFAULT 0,
    coupon_code    TEXT,
    total          NUMERIC     NOT NULL,
    status         TEXT        DEFAULT 'pending',
    payment_method TEXT        NOT NULL,
    notes          TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID        REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID        REFERENCES products(id) ON DELETE SET NULL,
    name       TEXT        NOT NULL,
    price      NUMERIC     NOT NULL,
    quantity   INTEGER     NOT NULL,
    size       TEXT,
    color      TEXT,
    image      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID        REFERENCES products(id) ON DELETE CASCADE,
    user_name      TEXT        NOT NULL,
    user_last_name TEXT,
    email          TEXT,
    rating         INTEGER     NOT NULL,
    comment        TEXT        NOT NULL,
    status         TEXT        DEFAULT 'pending',
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT        NOT NULL,
    full_name  TEXT,
    is_admin   BOOLEAN     DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    key        TEXT        NOT NULL UNIQUE,
    value      JSONB       NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code         TEXT        NOT NULL UNIQUE,
    type         TEXT        NOT NULL,
    value        NUMERIC     NOT NULL,
    min_purchase NUMERIC,
    max_uses     INTEGER,
    used_count   INTEGER     DEFAULT 0,
    valid_until  TIMESTAMPTZ,
    is_active    BOOLEAN     DEFAULT true,
    description  TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SECURITY (RLS)
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- PRODUCTS & CATEGORIES (Public Read, Admin Write)
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ORDERS (User Own Data, Admin All)
CREATE POLICY "User read own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
CREATE POLICY "User create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ORDER ITEMS
CREATE POLICY "User read own items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);
CREATE POLICY "User create items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- SETTINGS
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- PROFILES
CREATE POLICY "Read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- REVIEWS
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public create reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

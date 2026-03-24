-- ============================================================
-- SCHEMA JEANCOL — idempotente (ejecutar N veces sin errores)
-- Lo que no existe se crea; lo que existe se reemplaza/actualiza
-- ============================================================

-- ============================================
-- TABLA DE CATEGORÍAS
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL UNIQUE,
    image       TEXT        NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    price           NUMERIC     NOT NULL CHECK (price >= 0),
    category        TEXT        NOT NULL,
    image           TEXT        NOT NULL,
    images          TEXT[],
    video           TEXT,
    discount        TEXT,
    old_price       NUMERIC     CHECK (old_price IS NULL OR old_price >= 0),
    offer_price     NUMERIC     CHECK (offer_price IS NULL OR offer_price >= 0),
    offer_end_date  TIMESTAMPTZ,
    description     TEXT,
    features        JSONB,
    sizes           TEXT[],
    colors          JSONB,
    variations      JSONB,
    stock           INTEGER     DEFAULT 0 CHECK (stock >= 0),
    rating          NUMERIC     DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count   INTEGER     DEFAULT 0 CHECK (reviews_count >= 0),
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

-- ============================================
-- TABLA DE RESEÑAS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID        REFERENCES products(id) ON DELETE CASCADE,
    user_name      TEXT        NOT NULL,
    user_last_name TEXT        NOT NULL,
    email          TEXT,
    phone          TEXT,
    rating         INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment        TEXT        NOT NULL,
    date           TIMESTAMPTZ DEFAULT NOW(),
    avatar         TEXT,
    images         TEXT[],
    videos         TEXT[],
    status         TEXT        DEFAULT 'pending'
                               CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    customer       TEXT        NOT NULL,
    email          TEXT        NOT NULL,
    phone          TEXT        NOT NULL,
    address        TEXT        NOT NULL,
    city           TEXT        NOT NULL,
    department     TEXT        NOT NULL,
    subtotal       NUMERIC     NOT NULL CHECK (subtotal >= 0),
    shipping       NUMERIC     DEFAULT 0 CHECK (shipping >= 0),
    discount       NUMERIC     DEFAULT 0 CHECK (discount >= 0),
    coupon_code    TEXT,
    total          NUMERIC     NOT NULL CHECK (total >= 0),
    status         TEXT        DEFAULT 'pending'
                               CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
    payment_method TEXT        NOT NULL
                               CHECK (payment_method IN ('efectivo','transferencia','contraentrega')),
    notes          TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE ITEMS DE PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID        REFERENCES orders(id)   ON DELETE CASCADE,
    product_id UUID        REFERENCES products(id) ON DELETE SET NULL,
    name       TEXT        NOT NULL,
    price      NUMERIC     NOT NULL CHECK (price >= 0),
    quantity   INTEGER     NOT NULL CHECK (quantity > 0),
    size       TEXT,
    color      TEXT,
    image      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE CUPONES
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code         TEXT        NOT NULL UNIQUE,
    type         TEXT        NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value        NUMERIC     NOT NULL CHECK (value >= 0),
    min_purchase NUMERIC     CHECK (min_purchase IS NULL OR min_purchase >= 0),
    max_discount NUMERIC     CHECK (max_discount IS NULL OR max_discount >= 0),
    max_uses     INTEGER     CHECK (max_uses IS NULL OR max_uses > 0),
    used_count   INTEGER     DEFAULT 0 CHECK (used_count >= 0),
    valid_from   TIMESTAMPTZ DEFAULT NOW(),
    valid_until  TIMESTAMPTZ NOT NULL,
    is_active    BOOLEAN     DEFAULT true,
    description  TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE PERFILES (AUTH)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT        NOT NULL,
    full_name  TEXT,
    phone      TEXT,
    address    TEXT,
    city       TEXT,
    department TEXT,
    is_admin   BOOLEAN     DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA DE CONFIGURACIÓN
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    key        TEXT        NOT NULL UNIQUE,
    value      JSONB       NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price       ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_new      ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_trending ON products(is_trending);
CREATE INDEX IF NOT EXISTS idx_products_sku         ON products(sku);
CREATE INDEX IF NOT EXISTS idx_reviews_product      ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status       ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created       ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product  ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code         ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active       ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin     ON profiles(is_admin);

-- ============================================
-- FUNCIÓN update_updated_at (idempotente con OR REPLACE)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS updated_at — DROP + CREATE para idempotencia
-- ============================================
DROP TRIGGER IF EXISTS update_products_updated_at   ON products;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_orders_updated_at     ON orders;
DROP TRIGGER IF EXISTS update_reviews_updated_at    ON reviews;
DROP TRIGGER IF EXISTS update_coupons_updated_at    ON coupons;
DROP TRIGGER IF EXISTS update_settings_updated_at   ON settings;
DROP TRIGGER IF EXISTS update_profiles_updated_at   ON profiles;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FUNCIÓN handle_new_user (idempotente con OR REPLACE)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, is_admin)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        false
    )
    ON CONFLICT (id) DO UPDATE
        SET email     = EXCLUDED.email,
            full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;

-- ---- Políticas: PRODUCTS ----
DROP POLICY IF EXISTS "Public can read products"  ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

CREATE POLICY "Public can read products"  ON products FOR SELECT USING (true);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: CATEGORIES ----
DROP POLICY IF EXISTS "Public can read categories"  ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

CREATE POLICY "Public can read categories"  ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: REVIEWS ----
DROP POLICY IF EXISTS "Public can read approved reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can create reviews"        ON reviews;
DROP POLICY IF EXISTS "Admin can manage reviews"         ON reviews;

CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can create reviews"        ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage reviews"         ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: ORDERS ----
DROP POLICY IF EXISTS "Public can read orders"  ON orders;
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;

CREATE POLICY "Public can read orders"  ON orders FOR SELECT USING (true);
CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: ORDER_ITEMS ----
DROP POLICY IF EXISTS "Public can read order items"  ON order_items;
DROP POLICY IF EXISTS "Admin can manage order items" ON order_items;

CREATE POLICY "Public can read order items"  ON order_items FOR SELECT USING (true);
CREATE POLICY "Admin can manage order items" ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: COUPONS ----
DROP POLICY IF EXISTS "Public can read active coupons" ON coupons;
DROP POLICY IF EXISTS "Admin can manage coupons"       ON coupons;

CREATE POLICY "Public can read active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage coupons"       ON coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: SETTINGS ----
DROP POLICY IF EXISTS "Admin can manage settings"       ON settings;
DROP POLICY IF EXISTS "Public can read settings"        ON settings;

CREATE POLICY "Public can read settings"  ON settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ---- Políticas: PROFILES ----
DROP POLICY IF EXISTS "Users can read own profile"   ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can manage profiles"    ON profiles;

CREATE POLICY "Users can read own profile"   ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin can manage profiles"    ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================
-- DATOS INICIALES: CATEGORÍAS (upsert)
-- ============================================
INSERT INTO categories (id, name, image) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ropa',
     'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=200&q=80'),
    ('22222222-2222-2222-2222-222222222222', 'Accesorios',
     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'),
    ('33333333-3333-3333-3333-333333333333', 'Calzado',
     'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80')
ON CONFLICT (id) DO UPDATE
    SET name       = EXCLUDED.name,
        image      = EXCLUDED.image,
        updated_at = NOW();

-- ============================================
-- DATOS INICIALES: PRODUCTOS (upsert)
-- ============================================
INSERT INTO products (id, name, price, category, image, images, description, sizes, stock, rating, reviews_count, is_new, size_guide_type, offer_price, offer_end_date, old_price) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Zapatilla Pro-Lite', 356000, 'Calzado',
     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
     ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800&q=80'],
     'Comodidad y estilo para el día a día urbano. Fabricadas con materiales reciclados de alta calidad.',
     ARRAY['38','39','40','41','42','43'], 15, 4.8, 124, true, 'shoes', 260000, NOW() + INTERVAL '3 days', 356000),

    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Gafas Dark-Edge', 180000, 'Accesorios',
     'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80',
     ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80'],
     'Protección UV con diseño minimalista premium. Ideales para cualquier ocasión.',
     ARRAY['Única'], 8, 4.5, 89, false, NULL, 140000, NOW() + INTERVAL '5 days', 180000),

    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Camiseta Essential', 88000, 'Ropa',
     'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
     ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'],
     'Básico indispensable en algodón 100% orgánico.',
     ARRAY['S','M','L','XL'], 45, 4.9, 256, true, 'clothing', NULL, NULL, NULL),

    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Bolso Cuero Minimal', 480000, 'Accesorios',
     'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
     ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'],
     'Cuero genuino con acabados artesanales.',
     ARRAY['Única'], 5, 4.7, 42, false, NULL, 360000, NOW() + INTERVAL '2 days', 480000),

    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Lentes Sol Wood', 220000, 'Accesorios',
     'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?auto=format&fit=crop&w=400&q=80',
     ARRAY['https://images.unsplash.com/photo-1511499767390-903390e6fbc4?auto=format&fit=crop&w=400&q=80'],
     'Montura de madera sostenible con lentes polarizadas.',
     ARRAY['Única'], 12, 4.6, 67, true, NULL, NULL, NULL, NULL),

    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Cinturón Classic', 140000, 'Accesorios',
     'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
     ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'],
     'Elegancia atemporal en cuero negro.',
     ARRAY['85','90','95','100'], 20, 4.4, 34, false, 'accessories', 100000, NOW() + INTERVAL '1 day', 140000)
ON CONFLICT (id) DO UPDATE
    SET name           = EXCLUDED.name,
        price          = EXCLUDED.price,
        category       = EXCLUDED.category,
        image          = EXCLUDED.image,
        images         = EXCLUDED.images,
        description    = EXCLUDED.description,
        sizes          = EXCLUDED.sizes,
        stock          = EXCLUDED.stock,
        rating         = EXCLUDED.rating,
        reviews_count  = EXCLUDED.reviews_count,
        is_new         = EXCLUDED.is_new,
        size_guide_type= EXCLUDED.size_guide_type,
        offer_price    = EXCLUDED.offer_price,
        offer_end_date = EXCLUDED.offer_end_date,
        old_price      = EXCLUDED.old_price,
        updated_at     = NOW();

-- ============================================
-- DATOS INICIALES: RESEÑAS (upsert)
-- ============================================
INSERT INTO reviews (id, product_id, user_name, user_last_name, rating, comment, date, status) VALUES
    ('ee100001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Juan',  'Pérez',    5, 'Increíble calidad. El envío fue súper rápido y el empaque premium me sorprendió. Definitivamente volveré a comprar.', NOW() - INTERVAL '2 days',  'approved'),
    ('ee200002-0002-0002-0002-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'María', 'García',   4, 'Muy cómodas, aunque la talla viene un poco pequeña. Recomiendo pedir una talla más.',                              NOW() - INTERVAL '1 week',  'approved'),
    ('ee300003-0003-0003-0003-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ana',   'Martínez', 5, 'Superó mis expectativas.',                                                                                        NOW() - INTERVAL '5 days',  'approved')
ON CONFLICT (id) DO UPDATE
    SET rating     = EXCLUDED.rating,
        comment    = EXCLUDED.comment,
        status     = EXCLUDED.status,
        updated_at = NOW();

-- ============================================
-- DATOS INICIALES: PEDIDOS (upsert)
-- ============================================
INSERT INTO orders (id, customer, email, phone, address, city, department, subtotal, shipping, total, status, payment_method, created_at, updated_at) VALUES
    ('10000001-0001-0001-0001-000000000001', 'Juan Pérez',   'juan.perez@email.com',  '310 123 4567', 'Calle 100 #45-67, Apto 301', 'Bogotá',   'Cundinamarca', 536000, 15000, 551000, 'pending',    'efectivo',      NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day'),
    ('20000002-0002-0002-0002-000000000002', 'María García', 'maria.garcia@email.com','320 987 6543', 'Av. El Dorado #80-50',       'Medellín', 'Antioquia',    260000, 15000, 275000, 'processing', 'transferencia', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE
    SET status         = EXCLUDED.status,
        updated_at     = NOW();

INSERT INTO order_items (id, order_id, product_id, name, price, quantity, size, image) VALUES
    ('a0000001-0001-0001-0001-000000000001', '10000001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Zapatilla Pro-Lite', 356000, 1, '42',    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'),
    ('b0000002-0002-0002-0002-000000000002', '10000001-0001-0001-0001-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Gafas Dark-Edge',   180000, 1, 'Única', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DATOS INICIALES: CUPONES (upsert)
-- ============================================
INSERT INTO coupons (id, code, type, value, min_purchase, max_uses, valid_until, is_active, description) VALUES
    ('11111111-1111-1111-1111-111111111110', 'WELCOME10', 'percentage', 10,  50000,  NULL, NOW() + INTERVAL '1 year', true, '10% de descuento en tu primera compra'),
    ('22222222-2222-2222-2222-222222222220', 'JEANCOL15', 'percentage', 15, 100000,  NULL, NOW() + INTERVAL '1 year', true, '15% de descuento en compras mayores a $100.000'),
    ('33333333-3333-3333-3333-333333333330', 'FREESHIP',  'fixed',       0,  80000,  NULL, NOW() + INTERVAL '1 year', true, 'Envío gratis en compras mayores a $80.000'),
    ('44444444-4444-4444-4444-444444444440', 'SAVE20',    'percentage', 20, 200000,  NULL, NOW() + INTERVAL '1 year', true, '20% de descuento en compras mayores a $200.000')
ON CONFLICT (id) DO UPDATE
    SET code         = EXCLUDED.code,
        type         = EXCLUDED.type,
        value        = EXCLUDED.value,
        min_purchase = EXCLUDED.min_purchase,
        valid_until  = EXCLUDED.valid_until,
        is_active    = EXCLUDED.is_active,
        description  = EXCLUDED.description,
        updated_at   = NOW();

-- ============================================
-- DATOS INICIALES: CONFIGURACIÓN (upsert)
-- ============================================
INSERT INTO settings (key, value) VALUES
    ('store', '{"name":"JEANCOL","email":"contacto@jeancol.com","phone":"300 123 4567","whatsapp":"573001234567","freeShippingThreshold":95000,"shippingCost":14500}'),
    ('theme', '{"primary":"#7c3aed","dark":true}'),
    ('home',  '{"hero":{"title":"Nueva Colección 2026","subtitle":"Descubre las últimas tendencias en moda"},"featured":true,"trending":true}')
ON CONFLICT (key) DO UPDATE
    SET value      = EXCLUDED.value,
        updated_at = NOW();

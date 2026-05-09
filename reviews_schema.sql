-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone." ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Logged in users can post reviews." ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dummy Reviews
INSERT INTO reviews (product_id, rating, comment, is_verified_purchase)
SELECT id, 5, 'Absolutely incredible fit. The baggy denim is exactly what I was looking for. Quality is top-notch.', true
FROM products WHERE sku = 'VV-BAG-001' LIMIT 1;

INSERT INTO reviews (product_id, rating, comment, is_verified_purchase)
SELECT id, 4, 'Very comfortable for daily wear. The black wash is deep and looks premium. Fast delivery to Mumbai.', true
FROM products WHERE sku = 'VV-STR-002' LIMIT 1;

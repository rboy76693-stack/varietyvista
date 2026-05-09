-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can subscribe to newsletter." ON newsletter_subs
    FOR INSERT WITH CHECK (true);

-- Profiles Table for Customer Data
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Dummy Data for Variety Vista
INSERT INTO products (sku, name, price_inr, stock_count, is_active)
VALUES 
('VV-BAG-001', 'Baggy Cargo Denim - Black', 2199, 45, true),
('VV-STR-002', 'Straight Fit Black Denim', 1799, 12, true),
('VV-FLR-003', 'Flared Wide Leg Jeans', 2499, 30, true),
('VV-SKN-004', 'Classic Skinny Denim', 1599, 0, false),
('VV-JOG-005', 'Jogger Style Denim', 1899, 78, true);

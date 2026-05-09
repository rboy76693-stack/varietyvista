-- Enums for Indian market logistics & payment
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'cod');

-- Products Table (Built for India: includes GST tracking)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price_inr DECIMAL(10, 2) NOT NULL,
    gst_rate_percent DECIMAL(5,2) DEFAULT 5.00, -- Apparel < ₹1000 is 5%, > ₹1000 is 12%
    stock_count INTEGER NOT NULL CHECK (stock_count >= 0), -- Hard constraint: DB will reject negative stock
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    razorpay_order_id VARCHAR(255) UNIQUE,
    razorpay_payment_id VARCHAR(255) UNIQUE,
    total_amount_inr DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATOMIC INVENTORY DECREMENT (The Ultimate Fix for Race Conditions)
CREATE OR REPLACE FUNCTION decrement_inventory_atomic(product_id UUID, quantity INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET stock_count = stock_count - quantity
  WHERE id = product_id AND stock_count >= quantity;

  -- If no rows were updated, stock was insufficient. Supabase error prevented.
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- ==========================================
-- SUPABASE DATABASE WEBHOOKS (EDGE FUNCTION TRIGGER)
-- ==========================================

-- Enable the pg_net extension to make HTTP requests from Postgres
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the Webhook Trigger Function
CREATE OR REPLACE FUNCTION trigger_sms_on_paid_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if the status actually changed from something else TO 'paid'
  IF OLD.status IS DISTINCT FROM 'paid' AND NEW.status = 'paid' THEN
    -- Make a POST request to your Supabase Edge Function
    -- Replace the URL with your actual Edge Function URL when deployed
    PERFORM net.http_post(
      url:='https://your-project-ref.supabase.co/functions/v1/send-order-sms',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
      body:=json_build_object(
        'type', 'UPDATE',
        'table', 'orders',
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the Trigger to the Orders table
DROP TRIGGER IF EXISTS order_status_sms_trigger ON orders;
CREATE TRIGGER order_status_sms_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION trigger_sms_on_paid_order();

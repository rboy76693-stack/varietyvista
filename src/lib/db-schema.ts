export interface Product {
  id: string;
  sku: string;
  name: string;
  price_inr: number;
  gst_rate_percent: number;
  stock_count: number;
  is_active: boolean;
  category?: string;
  fit?: string;
  image_url?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  description?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
  address?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  total_amount_inr: number;
  status: OrderStatus;
  shipping_address: any;
  pincode: string;
  created_at: string;
  profile?: Profile;
  order_items?: OrderItem[];
}

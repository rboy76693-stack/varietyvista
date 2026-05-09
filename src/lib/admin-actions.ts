import { createClient } from "@/utils/supabase/client";
import { Product, Order, Profile } from "./db-schema";

const supabase = createClient();

export async function fetchAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function fetchAdminOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profile:user_id (
        id,
        full_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function fetchAdminCustomers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

export async function fetchDashboardStats() {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total_amount_inr, status');
  
  if (ordersError) throw ordersError;

  const { count: productCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productsError) throw productsError;

  const { count: customerCount, error: customersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (customersError) throw customersError;

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount_inr), 0);
  const totalOrders = orders.length;

  return {
    totalRevenue,
    totalOrders,
    productCount: productCount || 0,
    customerCount: customerCount || 0,
  };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

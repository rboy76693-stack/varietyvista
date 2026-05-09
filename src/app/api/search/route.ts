import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json([]);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, price_inr, sku')
    .ilike('name', `%${q}%`)
    .eq('is_active', true)
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

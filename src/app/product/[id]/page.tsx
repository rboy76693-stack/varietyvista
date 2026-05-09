import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!product) return { title: 'Product Not Found | Variety Vista' };

  return {
    title: `${product.name} | Variety Vista Premium Denim`,
    description: product.description || `Shop ${product.name} at Variety Vista. Premium streetwear and denim for the Indian market.`,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

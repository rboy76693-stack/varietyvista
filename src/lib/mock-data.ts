import { Product } from './db-schema';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    title: 'Vintage Wash Baggy Jeans',
    description: '100% Cotton non-stretch denim. Baggy 90s fit with heavy fading and subtle distress details. Made in India. Bio-washed for ultimate comfort.',
    price: 2199,
    images: ['/images/product_jeans.png'],
    category: 'baggy',
    stock: 50,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Washed Blue', 'Vintage Black']
  },
  {
    id: 'prod_2',
    title: 'Jet Black Straight Fit Denim',
    description: 'Premium rigid denim with a classic straight leg cut. Clean finish with no distressing for a sharp, versatile look. 100% Made in India.',
    price: 1899,
    images: ['/images/product_jeans.png'],
    category: 'straight',
    stock: 120,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Jet Black', 'Raw Indigo']
  },
  {
    id: 'prod_3',
    title: 'Utility Cargo Denim Pants',
    description: 'Hybrid cargo jeans featuring 6 functional pockets, wide-leg fit, and adjustable ankle toggles. Heavyweight denim built for the streets.',
    price: 2499,
    images: ['/images/product_jeans.png'],
    category: 'cargo',
    stock: 35,
    sizes: ['30', '32', '34', '36'],
    colors: ['Acid Wash Blue', 'Olive Overdye']
  },
  {
    id: 'prod_4',
    title: 'Y2K Flared Denim Jeans',
    description: 'Throwback Y2K style with a slim fit through the thigh that flares dramatically at the hem. Perfect for pairing with chunky sneakers.',
    price: 2299,
    images: ['/images/product_jeans.png'],
    category: 'flared',
    stock: 200,
    sizes: ['28', '30', '32', '34'],
    colors: ['Light Blue', 'Washed Black']
  }
];

export const mockCategories = [
  { name: 'Baggy Fits', slug: 'baggy' },
  { name: 'Straight Fits', slug: 'straight' },
  { name: 'Cargo Denim', slug: 'cargo' },
  { name: 'Flared Fits', slug: 'flared' }
];

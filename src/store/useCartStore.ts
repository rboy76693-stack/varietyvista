import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/db-schema';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (i) => i.product.id === item.product.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += item.quantity;
          return { items: newItems, isCartOpen: true };
        }
        
        return { items: [...state.items, item], isCartOpen: true };
      }),
      removeItem: (productId, size, color) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)
        )
      })),
      updateQuantity: (productId, size, color, quantity) => set((state) => ({
        items: state.items.map((i) => {
          if (i.product.id === productId && i.selectedSize === size && i.selectedColor === color) {
            return { ...i, quantity: Math.max(1, quantity) };
          }
          return i;
        })
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (Number(item.product.price_inr) * item.quantity), 0);
      },
      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'variety-vista-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

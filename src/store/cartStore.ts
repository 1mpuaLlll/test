import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  tokenId: number;
  priceInEth: number;
  rarity: string;
  pattern: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (tokenId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (tokenId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          // Проверяем, есть ли уже этот NFT в корзине
          if (state.items.find((i) => i.tokenId === item.tokenId)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),

      removeFromCart: (tokenId) =>
        set((state) => ({
          items: state.items.filter((item) => item.tokenId !== tokenId),
        })),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.priceInEth, 0);
      },

      getTotalItems: () => get().items.length,

      isInCart: (tokenId) => {
        return get().items.some((item) => item.tokenId === tokenId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

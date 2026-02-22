import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string | number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string | number, quantity: number) => void
  removeItem: (productId: string | number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const current = get().items
        const existing = current.find(i => i.productId === item.productId)

        if (existing) {
          set({
            items: current.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...current, item] })
        }
      },

      updateQuantity: (productId: string | number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      removeItem: (productId: string | number) => {
        set({ items: get().items.filter(i => i.productId !== productId) })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'shaurya-cart-v2',  // bumped version — clears any persisted stale medicine IDs
    }
  )
)

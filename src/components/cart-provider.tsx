"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  restaurantId: string
  restaurantSlug: string
  quantity: number
}

interface AddCartItemInput {
  id: string
  name: string
  price: number
  imageUrl: string
  restaurantId: string
  restaurantSlug: string
}

interface CartContextValue {
  items: CartItem[]
  total: number
  totalItems: number
  restaurantSlug: string | null
  addItem: (item: AddCartItemInput) => void
  decrementItem: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CART_STORAGE_KEY = "donalds_cart"

const CartContext = createContext<CartContextValue | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart) as CartItem[])
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      }
    }

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [isLoaded, items])

  const addItem = (item: AddCartItemInput) => {
    setItems((currentItems) => {
      const hasDifferentRestaurant = currentItems.some(
        (currentItem) => currentItem.restaurantId !== item.restaurantId,
      )

      if (hasDifferentRestaurant) {
        return [{ ...item, quantity: 1 }]
      }

      const existingItem = currentItems.find(
        (currentItem) => currentItem.id === item.id,
      )

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem,
        )
      }

      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const decrementItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== productId) {
          return item
        }

        if (item.quantity === 1) {
          return []
        }

        return { ...item, quantity: item.quantity - 1 }
      }),
    )
  }

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      items,
      total,
      totalItems,
      restaurantSlug: items[0]?.restaurantSlug ?? null,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider")
  }

  return context
}

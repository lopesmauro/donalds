"use client"

import { Product, Restaurant } from "@prisma/client"
import { ShoppingBagIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

interface AddToCartButtonProps {
  product: Pick<Product, "id" | "name" | "price" | "imageUrl" | "restaurantId">
  restaurant: Pick<Restaurant, "slug">
}

const AddToCartButton = ({ product, restaurant }: AddToCartButtonProps) => {
  const { addItem } = useCart()
  const [wasAdded, setWasAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      restaurantId: product.restaurantId,
      restaurantSlug: restaurant.slug,
    })
    setWasAdded(true)
    window.setTimeout(() => setWasAdded(false), 1800)
  }

  return (
    <Button className="mt-5 w-full" onClick={handleAddToCart} type="button">
      <ShoppingBagIcon />
      {wasAdded ? "Adicionado" : "Adicionar ao carrinho"}
    </Button>
  )
}

export default AddToCartButton

"use client"

import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

interface CartLinkButtonProps {
  slug: string
  className?: string
}

export const CartLinkButton = ({ slug, className }: CartLinkButtonProps) => {
  const { totalItems } = useCart()

  return (
    <Button asChild className={className} size="icon" variant="secondary">
      <Link href={`/${slug}/carrinho`}>
        <ShoppingBagIcon />
        {totalItems > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground">
            {totalItems}
          </span>
        ) : null}
      </Link>
    </Button>
  )
}

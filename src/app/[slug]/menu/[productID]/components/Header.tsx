"use client"

import { Product } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductImage } from "@/components/product-image"
import { CartLinkButton } from "@/components/cart-link-button"

interface ProductHeaderProps {
    product: Pick<Product, 'imageUrl' | 'name' | 'description'>
}

const Header = ({product}: ProductHeaderProps) => {
    const router = useRouter()
    const { slug } = useParams<{slug: string}>()
    const handleBackClick = () => {
        router.back()
    }
    return (
        <div className="relative bg-muted">
            <div className="mx-auto flex h-[320px] w-full max-w-5xl items-center justify-center px-6 sm:h-[420px] lg:h-[520px]">
                <div className="relative h-full w-full">
                    <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        priority
                        className="object-contain"
                    />
                </div>
            </div>
            <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-4 z-50 rounded-full shadow-sm sm:left-6 sm:top-6"
                onClick={handleBackClick}
            >
                <ChevronLeftIcon />
            </Button>
            <CartLinkButton
                slug={slug}
                className="absolute right-4 top-4 z-50 rounded-full shadow-sm sm:right-6 sm:top-6"
            />
        </div>
    )
}

export default Header

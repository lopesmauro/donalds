"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { Restaurant } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { CartLinkButton } from "@/components/cart-link-button"

interface RestaurantHeaderProps {
    restaurant: Pick<Restaurant, 'name' | 'coverImageUrl'>
}

const RestaurantHeader = ({restaurant}: RestaurantHeaderProps) => {
    const router = useRouter()
    const { slug } = useParams<{slug: string}>()
    const handleBackClick = () => router.back()

    return (
        <div className="relative h-[230px] w-full overflow-hidden bg-muted sm:h-[320px] lg:h-[380px]">
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
            <Image
                src={restaurant.coverImageUrl}
                alt={restaurant.name}
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
    )
}

export default RestaurantHeader

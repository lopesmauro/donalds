"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react"
import { Restaurant } from "@prisma/client"
import { useRouter } from "next/navigation"

interface RestaurantHeaderProps {
    restaurant: Pick<Restaurant, 'name' | 'coverImageUrl'>
}

const RestaurantHeader = ({restaurant}: RestaurantHeaderProps) => {
    const router = useRouter()
    const handleBackClick = () => router.back()

    return (
        <div className="relative h-[250px] w-full">
            <Button variant="secondary" size="icon" className="absolute top-4 left-4 rounded-full z-50" asChild onClick={handleBackClick}>
                <ChevronLeftIcon />
            </Button>
            <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full z-50" asChild>
                <ScrollTextIcon />
            </Button>
            <Image src={restaurant.coverImageUrl} alt={restaurant.name} fill className="object-cover" />

        </div>
    )
}

export default RestaurantHeader
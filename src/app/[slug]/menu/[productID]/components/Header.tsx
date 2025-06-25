"use client"

import { Product } from "@prisma/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductHeaderProps {
    product: Pick<Product, 'imageUrl' | 'description'>
}

const Header = ({product}: ProductHeaderProps) => {
    const router = useRouter()
    const handleBackClick = () => {
        router.back()
    }
    return (
        <>
            <div className="relative w-full h-[300px]">
                <Image src={product.imageUrl} alt={product.description} fill className="object-contain" />
            </div>
            <Button variant="secondary" size="icon" className="absolute top-4 left-4 rounded-full z-50" asChild onClick={handleBackClick}>
                <ChevronLeftIcon />
            </Button>
            <Button variant="secondary" size="icon" className="absolute top-4 right-4 rounded-full z-50" asChild>
                <ScrollTextIcon />
            </Button>
        </>
    )
}

export default Header
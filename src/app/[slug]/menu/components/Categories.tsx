"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Prisma, MenuCategory } from "@prisma/client"
import { ClockIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Products from "./Products"

interface RestaurantCategoriesProps {
    restaurant: Prisma.RestaurantGetPayload<{
        include: {
            menuCategories: {
                include: {products: true}
            }
        }
    }>
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
    include: {products: true}
}>

const RestaurantCategories = ({restaurant} : RestaurantCategoriesProps) => {
    const [selectCategorie, setSelectCategorie] = useState<MenuCategoryWithProducts>(restaurant.menuCategories[0])
    const handleCategorieClick = (category: MenuCategoryWithProducts) => {
        setSelectCategorie(category)
    }
    const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
        return selectCategorie.id == category.id ? "destructive" : "secondary"
    }

    return (
        <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white">
            <div className="p-5">
                <div className="flex items center gap-3">
                    <Image src={restaurant.avatarImageUrl} alt={restaurant.name} height={45} width={45} />
                    <div>
                        <h2 className="font-semibold text-lg">{restaurant.name}</h2>
                        <p className="text-xs opacity-55">{restaurant.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-3">
                    <ClockIcon size={12}/>
                    <p>Aberto</p>
                </div>
            </div>
            <div>
                <ScrollArea className="w-full">
                    <div className="flex w-max space-x-6 p-4 pt-0">
                        {restaurant.menuCategories.map(category => (
                            <Button key={category.id} onClick={() => handleCategorieClick(category)} variant={getCategoryButtonVariant(category)} size="sm" className="rounded-full">
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <h3 className="px-5 pt-2 font-semibold">{selectCategorie.name}</h3>
                <Products products={selectCategorie.products}/>
            </div>
        </div>
    )
}

export default RestaurantCategories
"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Prisma } from "@prisma/client"
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
    const [selectCategorie, setSelectCategorie] = useState<MenuCategoryWithProducts | null>(restaurant.menuCategories[0] ?? null)
    const handleCategorieClick = (category: MenuCategoryWithProducts) => {
        setSelectCategorie(category)
    }
    const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
        return selectCategorie?.id == category.id ? "destructive" : "secondary"
    }

    return (
        <div className="relative z-50 mx-auto mt-[-1.5rem] w-full max-w-5xl rounded-t-3xl bg-white shadow-sm lg:mt-[-3rem] lg:rounded-2xl">
            <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <Image src={restaurant.avatarImageUrl} alt={restaurant.name} height={56} width={56} className="rounded-full" />
                    <div>
                        <h2 className="text-lg font-semibold sm:text-2xl">{restaurant.name}</h2>
                        <p className="text-xs text-muted-foreground sm:text-sm">{restaurant.description}</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                    <ClockIcon size={12}/>
                    <p>Aberto</p>
                </div>
            </div>
            <div>
                <ScrollArea className="w-full">
                    <div className="flex w-max space-x-3 px-5 pb-4 sm:px-6">
                        {restaurant.menuCategories.map(category => (
                            <Button key={category.id} onClick={() => handleCategorieClick(category)} variant={getCategoryButtonVariant(category)} size="sm" className="rounded-full">
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {selectCategorie ? (
                    <>
                        <h3 className="px-5 pt-2 text-lg font-semibold sm:px-6 sm:text-xl">{selectCategorie.name}</h3>
                        <Products products={selectCategorie.products}/>
                    </>
                ) : (
                    <p className="px-5 pb-6 text-sm text-muted-foreground sm:px-6">
                        Nenhuma categoria cadastrada.
                    </p>
                )}
            </div>
        </div>
    )
}

export default RestaurantCategories

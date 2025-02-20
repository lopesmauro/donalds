import { getRestaurantBySlug } from "@/app/data/get-restaurant-by-slug"
import { notFound } from "next/navigation"
import RestaurantHeader from "./components/Header"

interface RestaurantMenuPageProps {
    params: Promise<{slug: string}> 
    searchParams: Promise<{method: string}>
}

const isConsumptionMethodValid = (method: string) => {
    return ["DINE_IN", "TAKE_AWAY"].includes(method)
}

const RestaurantMenuPage = async ({params, searchParams} : RestaurantMenuPageProps) => {
    const { method } = await searchParams
    const { slug } = await params

    if(!isConsumptionMethodValid(method)){
        return <div>Método não encontrado</div> 
    }

    const restaurant = await getRestaurantBySlug(slug)
    if (!restaurant) {
        return <div>Restaurante não encontrado</div>
    }

    return(
        <div>
            <RestaurantHeader restaurant={restaurant} />
        </div> 
    )
}

export default RestaurantMenuPage
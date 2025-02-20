import ConsumptionMethodOption from "./components/consumption-method-option"
import { getRestaurantBySlug } from "../data/get-restaurant-by-slug"
import Image from "next/image"

interface RestaurantPageProps {
    params: Promise<{slug: string}>
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
    const { slug } = await params
    const restaurant = await getRestaurantBySlug(slug)

    if (!restaurant) {
        return <div>Restaurante não encontrado</div>
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center px-6 pt-24">
            <div className="flex flex-col items-center gap-2">
                <Image src={restaurant.avatarImageUrl} alt={restaurant.name} width={82} height={82}/>
            </div>
            <h2 className="font-semibold">{restaurant.name}</h2>
            <div className="pt-24 text-center space-y-2">
                <h3 className="text-2xl font-semibold">Seja bem vindo</h3>
                <p>Escolha como prefere aproveitar sua refeição. Estamos aqui pra oferecer praticidade e sabor em cada detalhe!</p>
            </div>
            <div className="pt-14 grid grid-cols-2 gap-4">
                <ConsumptionMethodOption imageUrl="/dinein.png" imageAlt="Para comer aqui" buttonText="Para comer aqui" option="DINE_IN" slug={slug}/>
                <ConsumptionMethodOption imageUrl="/takeaway.png" imageAlt="Para levar" buttonText="Para levar" option="TAKEAWAY" slug={slug}/>
            </div>
        </div>    
    )
}

export default RestaurantPage 
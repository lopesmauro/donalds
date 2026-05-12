import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Header from "./components/Header"
import AddToCartButton from "./components/add-to-cart-button"

interface ProductPageProps {
    params: Promise<{slug: string, productID: string}>
}
const ProductPage = async ({params} : ProductPageProps) => {
    const {slug, productID} = await params
    const product = await db.product.findUnique({
        where: { id: productID },
        include: {
            restaurant: true,
            menuCategory: true,
        },
    })
    if(!product){
        return notFound()
    }

    if(product.restaurant.slug !== slug){
        return notFound()
    }

    return( 
        <main className="min-h-screen bg-background">
            <Header product={product} />
            <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-6 md:grid-cols-[1fr_320px] md:px-8 md:py-10">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            {product.menuCategory.name}
                        </p>
                        <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
                            {product.name}
                        </h1>
                        <p className="text-sm leading-6 text-muted-foreground md:text-base">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="font-semibold">Ingredientes</h2>
                        {product.ingredients.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {product.ingredients.map((ingredient) => (
                                    <span
                                        className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                                        key={ingredient}
                                    >
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhum ingrediente informado.
                            </p>
                        )}
                    </div>
                </div>

                <aside className="h-fit rounded-md border bg-card p-5 shadow-sm md:sticky md:top-6">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Preço</p>
                        <p className="text-3xl font-semibold">
                            {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(product.price)}
                        </p>
                    </div>
                    <div className="mt-5 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        Produto do restaurante {product.restaurant.name}.
                    </div>
                    <AddToCartButton product={product} restaurant={product.restaurant} />
                </aside>
            </section>
        </main>  
    )
}
export default ProductPage

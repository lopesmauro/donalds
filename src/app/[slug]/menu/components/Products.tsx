"use client"

import { Product } from "@prisma/client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProductImage } from "@/components/product-image"

interface ProductProps {
    products: Product[]
}

const Products = ({products} : ProductProps) => {
    const { slug } = useParams<{slug: string}>()
    return(
        <div className="grid gap-3 px-5 py-4 sm:px-6 md:grid-cols-2">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/${slug}/menu/${product.id}`}
                    className="flex min-h-[130px] items-center justify-between gap-4 rounded-md border bg-background p-3 transition-colors hover:bg-muted/50"
                >
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold md:text-base">
                            {product.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {product.description}
                        </p>
                        <p className="pt-3 text-sm font-semibold">
                            {Intl.NumberFormat("pt-BR", {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(product.price)}
                        </p>
                    </div>
                    <div className="relative h-[92px] w-[120px] shrink-0 md:h-[112px] md:w-[140px]">
                        <ProductImage src={product.imageUrl} alt={product.name} className="rounded-md object-contain" />
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Products

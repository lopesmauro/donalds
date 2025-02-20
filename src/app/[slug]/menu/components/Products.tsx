import { Product } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"

interface ProductProps {
    products: Product[]
}

const Products = ({products} : ProductProps) => {
    return(
        <div className="space-y-3 px-5 py-3">
            {products.map((product) => (
                <Link key={product.id} href="/" className="flex items-center justify-between gap-10 border-b py-3">
                    <div>
                        <h3 className="text-sm font-semibold">
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
                    <div className="relative min-h-[82px] min-w-[120px]">
                        <Image src={product.imageUrl} alt={product.name} fill className="rounded-lg object-contain">

                        </Image>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Products
import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Header from "./components/Header"

interface ProductPageProps {
    params: Promise<{slug: string, productID: string}>
}
const ProductPage = async ({params} : ProductPageProps) => {
    const {slug, productID} = await params
    const product = await db.product.findUnique({where: { id: productID }})
    if(!product){
        return notFound()
    }

    return( 
        <>
            <Header product={product} />
            <h1>{slug} {productID}</h1>
        </>  
    )
}
export default ProductPage
import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface ProductPageProps {
    params: Promise<{slug: string, productID: string}>
}
const ProductPage = async ({params} : ProductPageProps) => {
    const {slug, productID} = await params
    const product = db.product.findUnique({where: {id: productID}})
    if(!product){
        return notFound()
    }
    return(
        <h1>{slug} {productID}</h1>
    )
}
export default ProductPage
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

export default async function Home() {
  const restaurant = await db.restaurant.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  })

  if (!restaurant) {
    redirect("/admin")
  }

  redirect(`/${restaurant.slug}`)
}
 

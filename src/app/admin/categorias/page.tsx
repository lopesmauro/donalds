import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRestaurantId, requireUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    restaurantId?: string;
  }>;
}

const AdminCategoriesPage = async ({ searchParams }: AdminCategoriesPageProps) => {
  const user = await requireUser();
  const scopedRestaurantId = getUserRestaurantId(user);
  const { restaurantId } = await searchParams;
  const selectedRestaurantId = scopedRestaurantId ?? restaurantId ?? "";
  const restaurantFilter = selectedRestaurantId
    ? {
        restaurantId: selectedRestaurantId,
      }
    : {};
  const restaurantList = await db.restaurant.findMany({
    where: scopedRestaurantId
      ? {
          id: scopedRestaurantId,
        }
      : {},
    orderBy: {
      name: "asc",
    },
  });

  const categories = await db.menuCategory.findMany({
    where: restaurantFilter,
    orderBy: [
      {
        restaurant: {
          name: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
    include: {
      restaurant: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <AdminShell title="Categorias">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Todas as seções cadastradas no cardápio.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/categorias/nova">Criar categoria</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!scopedRestaurantId ? (
            <form className="mb-4 flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium" htmlFor="restaurantId">
                  Restaurante
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue={selectedRestaurantId}
                  id="restaurantId"
                  name="restaurantId"
                >
                  <option value="">Todos</option>
                  {restaurantList.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Filtrar</Button>
            </form>
          ) : null}
          {categories.length > 0 ? (
            <div className="divide-y rounded-md border">
              {categories.map((category) => (
                <div
                  className="grid gap-1 p-4 text-sm sm:grid-cols-[1fr_180px_120px] sm:items-center"
                  key={category.id}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-muted-foreground">
                    {category.restaurant.name}
                  </div>
                  <div className="sm:text-right">
                    {category._count.products} produto(s)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhuma categoria cadastrada.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default AdminCategoriesPage;

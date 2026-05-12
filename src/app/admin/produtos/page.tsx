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

interface AdminProductsPageProps {
  searchParams: Promise<{
    restaurantId?: string;
  }>;
}

const AdminProductsPage = async ({ searchParams }: AdminProductsPageProps) => {
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

  const products = await db.product.findMany({
    where: restaurantFilter,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      restaurant: true,
      menuCategory: true,
    },
  });
  return (
    <AdminShell title="Produtos">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Todos os itens cadastrados para venda.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/produtos/novo">Criar produto</Link>
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
          {products.length > 0 ? (
            <div className="divide-y rounded-md border">
              {products.map((product) => (
                <div
                  className="grid gap-2 p-4 text-sm lg:grid-cols-[1fr_160px_160px_110px] lg:items-center"
                  key={product.id}
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <p className="line-clamp-2 text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <div>{product.menuCategory.name}</div>
                  <div className="text-muted-foreground">
                    {product.restaurant.name}
                  </div>
                  <div className="font-medium lg:text-right">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhum produto cadastrado.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default AdminProductsPage;

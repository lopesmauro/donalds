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

const AdminRestaurantPage = async () => {
  const user = await requireUser();
  const scopedRestaurantId = getUserRestaurantId(user);
  const restaurants = await db.restaurant.findMany({
    where: scopedRestaurantId
      ? {
          id: scopedRestaurantId,
        }
      : {},
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          menuCategories: true,
          products: true,
          orders: true,
          users: true,
        },
      },
    },
  });

  return (
    <AdminShell title="Restaurantes">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Restaurantes</CardTitle>
            <CardDescription>
              Lojas cadastradas e seus dados principais.
            </CardDescription>
          </div>
          {!scopedRestaurantId ? (
            <Button asChild>
              <Link href="/admin/restaurante/novo">Criar restaurante</Link>
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {restaurants.length > 0 ? (
            <div className="divide-y rounded-md border">
              {restaurants.map((restaurant) => (
                <div className="space-y-3 p-4 text-sm" key={restaurant.id}>
                  <div className="grid gap-2 md:grid-cols-[1fr_160px] md:items-start">
                    <div>
                      <div className="font-medium">{restaurant.name}</div>
                      <div className="text-muted-foreground">
                        /{restaurant.slug}
                      </div>
                    </div>
                    <div className="text-muted-foreground md:text-right">
                      {restaurant._count.users} usuário(s)
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {restaurant.description}
                  </p>
                  <div className="grid gap-2 text-muted-foreground sm:grid-cols-3">
                    <div>{restaurant._count.menuCategories} categoria(s)</div>
                    <div>{restaurant._count.products} produto(s)</div>
                    <div>{restaurant._count.orders} pedido(s)</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhum restaurante cadastrado ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default AdminRestaurantPage;

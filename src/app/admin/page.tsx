import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserRestaurantId, requireUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AdminShell } from "./components/admin-shell";

const AdminPage = async () => {
  const user = await requireUser();
  const scopedRestaurantId = getUserRestaurantId(user);
  const restaurantWhere = scopedRestaurantId ? { restaurantId: scopedRestaurantId } : {};
  const [categories, products, orders, latestOrders] =
    await Promise.all([
      db.menuCategory.count({ where: restaurantWhere }),
      db.product.count({ where: restaurantWhere }),
      db.order.count({ where: restaurantWhere }),
      db.order.findMany({
        where: restaurantWhere,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          restaurant: true,
          orderProducts: true,
        },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Categorias", value: categories },
    { label: "Produtos", value: products },
    { label: "Pedidos", value: orders },
  ];

  return (
    <AdminShell>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Ações rápidas</CardTitle>
              <CardDescription>
                Crie registros nas telas dedicadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/admin/categorias/nova">Criar categoria</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/produtos/novo">Criar produto</Link>
                </Button>
                {user.role === "ADMIN" ? (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/admin/restaurante/novo">Criar restaurante</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/admin/usuarios/novo">Criar usuário</Link>
                    </Button>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos recentes</CardTitle>
              <CardDescription>
                Últimos pedidos criados na aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestOrders.length > 0 ? (
                <div className="divide-y rounded-md border">
                  {latestOrders.map((order) => (
                    <div
                      className="grid gap-2 p-4 text-sm sm:grid-cols-4 sm:items-center"
                      key={order.id}
                    >
                      <div className="font-medium">Pedido #{order.id}</div>
                      <div>{order.restaurant.name}</div>
                      <div>{order.orderProducts.length} item(ns)</div>
                      <div className="sm:text-right">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum pedido criado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

    </AdminShell>
  );
};

export default AdminPage;

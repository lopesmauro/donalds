import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserRestaurantId, requireUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

const orderStatusLabels = {
  PENDING: "Pendente",
  IN_PREPARATION: "Em preparo",
  FINISHED: "Finalizado",
};

const consumptionMethodLabels = {
  DINE_IN: "Comer no local",
  TAKEAWAY: "Para levar",
};

const paymentMethodLabels = {
  CREDIT_CARD: "Crédito",
  DEBIT_CARD: "Débito",
  PIX: "Pix",
  CASH: "Dinheiro",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    restaurantId?: string;
  }>;
}

const AdminOrdersPage = async ({ searchParams }: AdminOrdersPageProps) => {
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

  const orders = await db.order.findMany({
    where: restaurantFilter,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      restaurant: true,
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <AdminShell title="Pedidos">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Histórico de pedidos criados na aplicação.
          </CardDescription>
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
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div className="rounded-md border p-4" key={order.id}>
                  <div className="grid gap-2 text-sm md:grid-cols-6 md:items-center">
                    <div className="font-medium">Pedido #{order.id}</div>
                    <div>{order.restaurant.name}</div>
                    <div>
                      <div>{order.customerName || "Cliente"}</div>
                      <div className="text-muted-foreground">
                        {order.customerPhone || "Sem telefone"}
                      </div>
                    </div>
                    <div>{orderStatusLabels[order.status]}</div>
                    <div>
                      <div>{consumptionMethodLabels[order.consumptionMethod]}</div>
                      <div className="text-muted-foreground">
                        {paymentMethodLabels[order.paymentMethod]}
                      </div>
                    </div>
                    <div className="font-medium md:text-right">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                  {order.notes || order.customerDocument || order.changeFor ? (
                    <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                      {order.customerDocument ? (
                        <p>CPF: {order.customerDocument}</p>
                      ) : null}
                      {order.changeFor ? (
                        <p>Troco para: R$ {order.changeFor.toFixed(2).replace(".", ",")}</p>
                      ) : null}
                      {order.notes ? <p>Obs: {order.notes}</p> : null}
                    </div>
                  ) : null}
                  <div className="mt-4 divide-y rounded-md border bg-muted/40">
                    {order.orderProducts.map((orderProduct) => (
                      <div
                        className="grid gap-1 p-3 text-sm sm:grid-cols-[1fr_80px_100px] sm:items-center"
                        key={orderProduct.id}
                      >
                        <div>{orderProduct.product.name}</div>
                        <div>{orderProduct.quantity} un.</div>
                        <div className="sm:text-right">
                          R$ {orderProduct.price.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    ))}
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
    </AdminShell>
  );
};

export default AdminOrdersPage;

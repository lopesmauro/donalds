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
import { createCategory } from "../../actions";
import { AdminShell } from "../../components/admin-shell";

const NewCategoryPage = async () => {
  const user = await requireUser();
  const scopedRestaurantId = getUserRestaurantId(user);
  const restaurants = await db.restaurant.findMany({
    where: scopedRestaurantId ? { id: scopedRestaurantId } : {},
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminShell title="Criar categoria">
      <Card>
        <CardHeader>
          <CardTitle>Nova categoria</CardTitle>
          <CardDescription>
            Adicione uma seção ao cardápio do restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="space-y-4">
            {!scopedRestaurantId ? (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="restaurantId">
                  Restaurante
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="restaurantId"
                  name="restaurantId"
                  required
                >
                  <option value="">Selecione</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nome
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="name"
                name="name"
                placeholder="Sobremesas"
                required
              />
            </div>
            <Button type="submit" disabled={restaurants.length === 0}>
              Criar categoria
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default NewCategoryPage;

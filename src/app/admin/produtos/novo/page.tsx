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
import { createProduct } from "../../actions";
import { AdminShell } from "../../components/admin-shell";

const NewProductPage = async () => {
  const user = await requireUser();
  const scopedRestaurantId = getUserRestaurantId(user);
  const categories = await db.menuCategory.findMany({
    where: scopedRestaurantId ? { restaurantId: scopedRestaurantId } : {},
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
    },
  });

  return (
    <AdminShell title="Criar produto">
      <Card>
        <CardHeader>
          <CardTitle>Novo produto</CardTitle>
          <CardDescription>
            Cadastre um item para aparecer no menu público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="menuCategoryId">
                  Categoria
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="menuCategoryId"
                  name="menuCategoryId"
                  required
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} - {category.restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="price">
                  Preço
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="price"
                  min="0.01"
                  name="price"
                  placeholder="29,90"
                  required
                  step="0.01"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nome
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Descrição
              </label>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="description"
                name="description"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="imageUrl">
                URL da imagem
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="imageUrl"
                name="imageUrl"
                placeholder="https://..."
                required
                type="url"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="ingredients">
                Ingredientes
              </label>
              <textarea
                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="ingredients"
                name="ingredients"
                placeholder="Um por linha ou separados por vírgula"
              />
            </div>
            <Button type="submit" disabled={categories.length === 0}>
              Criar produto
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default NewProductPage;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { createUser } from "../../actions";
import { AdminShell } from "../../components/admin-shell";

const NewUserPage = async () => {
  await requireAdmin();

  const restaurants = await db.restaurant.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminShell title="Criar usuário">
      <Card>
        <CardHeader>
          <CardTitle>Novo usuário</CardTitle>
          <CardDescription>
            Cadastre administradores ou donos de restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="email"
                  name="email"
                  required
                  type="email"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Senha
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="password"
                  name="password"
                  required
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="role">
                  Tipo
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="OWNER"
                  id="role"
                  name="role"
                  required
                >
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="restaurantId">
                  Restaurante
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="restaurantId"
                  name="restaurantId"
                >
                  <option value="">Sem restaurante</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit">Criar usuário</Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default NewUserPage;

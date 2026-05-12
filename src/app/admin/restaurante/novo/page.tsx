import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createRestaurant } from "../../actions";
import { AdminShell } from "../../components/admin-shell";

const NewRestaurantPage = async () => {
  await requireAdmin();

  return (
    <AdminShell title="Criar restaurante">
      <Card>
        <CardHeader>
          <CardTitle>Novo restaurante</CardTitle>
          <CardDescription>
            Cadastre uma nova loja para gerenciar no painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createRestaurant} className="space-y-4">
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
                <label className="text-sm font-medium" htmlFor="slug">
                  Slug
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="slug"
                  name="slug"
                  placeholder="minha-loja"
                  required
                />
              </div>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="avatarImageUrl">
                  URL do avatar
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="avatarImageUrl"
                  name="avatarImageUrl"
                  required
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="coverImageUrl">
                  URL da capa
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="coverImageUrl"
                  name="coverImageUrl"
                  required
                  type="url"
                />
              </div>
            </div>
            <Button type="submit">Criar restaurante</Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default NewRestaurantPage;

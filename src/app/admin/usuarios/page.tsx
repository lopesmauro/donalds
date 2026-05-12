import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";

const roleLabels = {
  ADMIN: "Admin",
  OWNER: "Owner",
};

const AdminUsersPage = async () => {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <AdminShell title="Usuários">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Contas com acesso ao painel administrativo.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/usuarios/novo">Criar usuário</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="divide-y rounded-md border">
              {users.map((user) => (
                <div
                  className="grid gap-1 p-4 text-sm md:grid-cols-[1fr_220px_120px_180px] md:items-center"
                  key={user.id}
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </div>
                  <div>{user.restaurant?.name ?? "Todos os restaurantes"}</div>
                  <div>{roleLabels[user.role]}</div>
                  <div className="text-muted-foreground md:text-right">
                    {user.createdAt.toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhum usuário cadastrado.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
};

export default AdminUsersPage;

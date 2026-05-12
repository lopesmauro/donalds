import { type ReactNode, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "../actions";
import { AdminToast } from "./admin-toast";
import { requireUser } from "@/lib/auth";

interface AdminShellProps {
  children: ReactNode;
  title?: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/restaurante", label: "Restaurante" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export const AdminShell = ({
  children,
  title = "Painel administrativo",
}: AdminShellProps) => {
  return <AdminShellContent title={title}>{children}</AdminShellContent>;
};

const AdminShellContent = async ({
  children,
  title,
}: Required<AdminShellProps>) => {
  const user = await requireUser();
  const visibleNavItems = navItems.filter(
    (item) => user.role === "ADMIN" || item.href !== "/admin/usuarios",
  );

  return (
    <main className="min-h-screen bg-muted">
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">MF Donalds</p>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {visibleNavItems.map((item) => (
              <Button asChild key={item.href} variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <form action={logout}>
              <Button type="submit" variant="outline">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        {children}
      </div>
    </main>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const messages = {
  category_created: "Categoria criada com sucesso.",
  product_created: "Produto criado com sucesso.",
  restaurant_created: "Restaurante criado com sucesso.",
  restaurant_updated: "Restaurante atualizado com sucesso.",
  user_created: "Usuário criado com sucesso.",
};

export const AdminToast = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = searchParams.get("toast");
  const [visible, setVisible] = useState(Boolean(toast));
  const message = messages[toast as keyof typeof messages];

  useEffect(() => {
    if (!message) {
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace(window.location.pathname, { scroll: false });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message, router]);

  if (!message || !visible) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 rounded-md border bg-background px-4 py-3 text-sm font-medium shadow-lg">
      {message}
    </div>
  );
};

"use client"

import Link from "next/link"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useParams } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { createOrder } from "./actions"

const formatCurrency = (value: number) =>
  Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

const CartPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { items, total, decrementItem, addItem, removeItem, clearCart } = useCart()
  const restaurantItems = items.filter((item) => item.restaurantSlug === slug)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(null), 3000)

    return () => window.clearTimeout(timer)
  }, [toast])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const requiredFields = [
      "customerName",
      "customerPhone",
      "consumptionMethod",
      "paymentMethod",
    ]
    const hasMissingField = requiredFields.some(
      (field) => !String(formData.get(field) ?? "").trim(),
    )

    if (hasMissingField) {
      setToast({
        message: "Preencha todos os campos obrigatórios.",
        type: "error",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const changeForValue = String(formData.get("changeFor") ?? "").trim()
      const result = await createOrder({
        slug,
        customerName: String(formData.get("customerName") ?? ""),
        customerPhone: String(formData.get("customerPhone") ?? ""),
        customerDocument: String(formData.get("document") ?? ""),
        consumptionMethod: String(formData.get("consumptionMethod")) as "DINE_IN" | "TAKEAWAY",
        paymentMethod: String(formData.get("paymentMethod")) as
          | "CREDIT_CARD"
          | "DEBIT_CARD"
          | "PIX"
          | "CASH",
        changeFor: changeForValue ? Number(changeForValue) : null,
        notes: String(formData.get("notes") ?? ""),
        items: restaurantItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      })

      if (!result.success) {
        setToast({
          message: result.error,
          type: "error",
        })
        return
      }

      setToast({
        message: `Pedido #${result.orderId} confirmado.`,
        type: "success",
      })
      clearCart()
      setPaymentMethod("")
      form.reset()
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível finalizar o pedido.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-6">
      {toast ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          <div
            className={`w-full max-w-sm rounded-md border px-5 py-4 text-center text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Seu pedido</p>
            <h1 className="text-2xl font-semibold">Carrinho</h1>
          </div>
          <Button asChild variant="outline">
            <Link href={`/${slug}/menu?method=DINE_IN`}>Continuar comprando</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Itens</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurantItems.length > 0 ? (
              <div className="space-y-4">
                <div className="divide-y rounded-md border bg-background">
                  {restaurantItems.map((item) => (
                    <div
                      className="grid gap-3 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center"
                      key={item.id}
                    >
                      <div className="relative h-20 w-24">
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.name}
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="font-medium">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <Button
                          onClick={() => decrementItem(item.id)}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <MinusIcon />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => addItem(item)}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <PlusIcon />
                        </Button>
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="rounded-md border bg-background p-4">
                    <div className="mb-4">
                      <h2 className="font-semibold">Informações do pedido</h2>
                      <p className="text-sm text-muted-foreground">
                        Esses dados serão usados para identificar seu pedido.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="customerName">
                          Nome <span className="text-destructive">*</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          id="customerName"
                          name="customerName"
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="customerPhone">
                          Telefone <span className="text-destructive">*</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          id="customerPhone"
                          name="customerPhone"
                          placeholder="(00) 00000-0000"
                          required
                          type="tel"
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="consumptionMethod">
                          Consumo <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue="DINE_IN"
                          id="consumptionMethod"
                          name="consumptionMethod"
                          required
                        >
                          <option value="DINE_IN">Comer no local</option>
                          <option value="TAKEAWAY">Para levar</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="paymentMethod">
                          Pagamento <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          defaultValue=""
                          id="paymentMethod"
                          name="paymentMethod"
                          onChange={(event) => setPaymentMethod(event.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          <option value="CREDIT_CARD">Cartão de crédito</option>
                          <option value="DEBIT_CARD">Cartão de débito</option>
                          <option value="PIX">Pix</option>
                          <option value="CASH">Dinheiro</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="document">
                          CPF
                        </label>
                        <input
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          id="document"
                          name="document"
                          placeholder="Opcional"
                        />
                      </div>
                      {paymentMethod === "CASH" ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="changeFor">
                            Troco para
                          </label>
                          <input
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            id="changeFor"
                            min="0"
                            name="changeFor"
                            placeholder="Opcional"
                            step="0.01"
                            type="number"
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium" htmlFor="notes">
                        Observações
                      </label>
                      <textarea
                        className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        id="notes"
                        name="notes"
                        placeholder="Ex: sem cebola, retirar no balcão..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-md border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-semibold">{formatCurrency(total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={clearCart} type="button" variant="outline">
                        Limpar
                      </Button>
                      <Button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Finalizando..." : "Finalizar pedido"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center">
                <p className="font-medium">Seu carrinho está vazio.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha um produto no menu para começar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default CartPage

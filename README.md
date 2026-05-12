# Donalds

Sistema de cardapio, carrinho e pedidos para restaurantes, feito com Next.js,
Prisma e PostgreSQL.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL em Docker

## Como o projeto roda

Neste projeto, apenas o banco roda em container. A aplicacao Next.js roda
direto na maquina com `npm run dev`.

## Requisitos

- Node.js 20 ou superior recomendado
- npm
- Docker Desktop com integracao WSL habilitada, se estiver usando WSL

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=donalds
POSTGRES_PORT=5432

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/donalds?schema=public"

ADMIN_EMAIL=admin@donalds.local
ADMIN_PASSWORD=admin123
OWNER_EMAIL=owner@donalds.local
OWNER_PASSWORD=owner123
SESSION_SECRET=dev-secret-change-me
```

Em producao, troque `SESSION_SECRET` e as senhas padrao.

## Setup local

Instale as dependencias:

```bash
npm install
```

Suba o banco:

```bash
docker compose up -d
```

Aplique as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Popule o banco:

```bash
npx prisma db seed
```

Rode a aplicacao:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

A raiz redireciona para o primeiro restaurante cadastrado.

## Usuarios padrao

Depois do seed:

```text
Admin: admin@donalds.local / admin123
Owner: owner@donalds.local / owner123
```

O `ADMIN` acessa todos os restaurantes e pode criar usuarios. O `OWNER` acessa
somente o restaurante vinculado ao seu usuario.

## Rotas principais

Area publica:

```text
/:slug
/:slug/menu?method=DINE_IN
/:slug/menu/:productId
/:slug/carrinho
```

Area administrativa:

```text
/admin
/admin/login
/admin/restaurante
/admin/restaurante/novo
/admin/categorias
/admin/categorias/nova
/admin/produtos
/admin/produtos/novo
/admin/pedidos
/admin/usuarios
/admin/usuarios/novo
```

## Funcionalidades

Area publica:

- Escolha do metodo de consumo
- Listagem de categorias e produtos
- Detalhe do produto
- Carrinho global no front-end
- Persistencia do carrinho em `localStorage`
- Formulario de checkout
- Criacao de pedidos no banco

Admin:

- Login com sessao por cookie
- Dashboard com resumo
- Cadastro e listagem de restaurantes
- Cadastro e listagem de categorias
- Cadastro e listagem de produtos
- Listagem de pedidos
- Cadastro e listagem de usuarios
- Escopo por restaurante para usuarios `OWNER`

## Server Components e Server Actions

O projeto usa o App Router do Next.js e aproveita Server Components para buscar
dados diretamente no servidor, sem expor consultas Prisma para o navegador.

Exemplos de Server Components:

- Paginas publicas de restaurante, menu e produto
- Paginas administrativas de listagem
- Dashboard administrativo

Essas telas podem chamar o Prisma diretamente no servidor, por exemplo com
`db.restaurant.findMany`, `db.product.findMany` e `db.order.findMany`.

O projeto tambem usa Server Actions para mutacoes de dados e fluxos de
servidor.

Exemplos de Server Actions:

- Login e logout
- Criacao de restaurante
- Criacao de categorias
- Criacao de produtos
- Criacao de usuarios
- Checkout do carrinho, criando `Order` e `OrderProduct`

Componentes interativos, como carrinho, toast, botoes de adicionar produto e
controles de quantidade, usam Client Components com `"use client"`.

## Carrinho e pedidos

O carrinho existe no front-end e fica salvo no `localStorage`. Ao finalizar o
pedido, a aplicacao envia os itens e dados do formulario para uma Server Action,
que cria:

- `Order`
- `OrderProduct`

A tela `/admin/pedidos` lista os pedidos salvos no banco.

## Comandos uteis

Rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Verificar tipos:

```bash
npx tsc --noEmit
```

Build:

```bash
npm run build
```

Aplicar migrations:

```bash
npx prisma migrate deploy
```

Criar migration em desenvolvimento:

```bash
npx prisma migrate dev --name nome_da_migration
```

Rodar seed:

```bash
npx prisma db seed
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

## Observacoes

- Se `docker-compose` nao existir no WSL, use `docker compose`.
- Se o Prisma Client parecer desatualizado, rode `npx prisma generate` e reinicie
  o `npm run dev`.
- Se alterar `next.config.ts`, reinicie o servidor de desenvolvimento.

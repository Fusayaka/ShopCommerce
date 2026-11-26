# ShopCommerce

A full-stack T-shirt storefront with a customer shop and an admin/manager dashboard.

- **Frontend** — React 19 + Vite, TypeScript, Tailwind CSS v4, React Router, Axios.
- **Backend** — NestJS 12, Prisma 7 (`pg` adapter), PostgreSQL, JWT auth, Cloudinary (image upload), Resend (email).
- **Database** — PostgreSQL. Schema, functions, triggers and seed data are plain SQL scripts in [`database/`](database/) (there are no Prisma migrations — see the note in [Quick Start](#1-quick-start-local-dev)).

## 1. Quick Start (local dev)

Prerequisites:

- Node 20+
- A running PostgreSQL instance
- `psql`

**1. Install dependencies** (root = frontend, `backend/` = API):

```bash
npm install
npm install --prefix backend
```

**2. Create the database schema and seed it.** This project manages its schema with raw SQL, not `prisma migrate`. Run the scripts in order against your database (the scripts drop existing data):

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/shopcommerce"
cd database
psql "$DATABASE_URL" -f schema.sql -f functions.sql -f trigger.sql -f seed.sql
```

See [`database/README.md`](database/README.md) for details and how to re-seed.

**3. Configure environment variables.**

`backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/shopcommerce
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
PORT=3000
# image upload (optional unless you use avatar/product image upload)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...
```

`.env` (frontend, at repo root — see [`.env.example`](.env.example)):

```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_DEFAULT_PAGE_SIZE=10
VITE_APP_NAME=ShopCommerce
VITE_SEARCH_LIMIT=10
```

**4. Run both apps:**

```bash
npm run dev        # frontend (Vite) + backend (Nest watch) together or separately:
npm run dev:fe     # Vite dev server  -> http://localhost:5173
npm run dev:be     # Nest API (watch) -> http://localhost:3000/api
```

## 2. Scripts

- **Root** (`package.json`) — `dev`, `dev:fe`, `dev:be`, `build` (`tsc -b && vite build`), `lint`, `preview`.
- **Backend** (`backend/package.json`) — `start`, `start:dev`, `start:prod`, `build`, `lint`, `test`, `test:e2e`.

## 3. Default test accounts

The seed (`database/seed.sql`) creates 10 users. All share the password **`admin123`**.

| Role     | Email               | Password   |
|----------|---------------------|------------|
| admin    | `minh@example.com`  | `admin123` |
| manager  | `lan@example.com`   | `admin123` |
| customer | `hoang@example.com` | `admin123` |

## 4. Docs

- [`docs/architecture.md`](docs/architecture.md) — directory layout, auth/RBAC flow, and core business flows.
- [`docs/api-reference.md`](docs/api-reference.md) — REST endpoints, role permissions, and request/response conventions.
- [`docs/notes.md`](docs/notes.md) — handover notes, known limitations, and operational caveats.
- [`database/README.md`](database/README.md) — database schema, triggers, and re-seeding guide.
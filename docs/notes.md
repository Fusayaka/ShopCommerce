# Developer Notes

Scratchpad for known issues, gotchas, and TODOs. Grounded in the current code — update as things change.

## 1. Known issues

_None open._

## 2. Gotchas

- **Schema source of truth is raw SQL** in [`database/`](../database/), not Prisma migrations. When
  the model changes, edit `schema.sql` **and** `backend/prisma/schema.prisma` together.
- **No automatic restock on cancellation.** `updateOrder` only changes status; stock is returned
  manually via the product-stock endpoints. Don't assume cancelling an order frees inventory.
- **`JwtAuthGuard` is global** (`APP_GUARD`). New routes are authenticated by default — add
  `@Public()` for anonymous access.
- **Token split:** access token in `localStorage`, refresh token in an `HttpOnly` cookie. Any call
  that relies on the cookie (e.g. refresh) needs `withCredentials`.
- **`resend` is installed but unused** — email isn't wired anywhere in `backend/src`, though the
  README lists it. Either implement it or drop the dep + mention.
- **`ROUTES.ORDER_DETAIL`** (`src/constants/routes.ts`) is marked *"Not implement yet"*.

## 3. TODO

- [ ] Decide on email: wire Resend, or remove the dependency and the README claim.
- [ ] Implement the order-detail route/page, or remove `ROUTES.ORDER_DETAIL`.
- [ ] Implement login with social network account(Facebook, Google).

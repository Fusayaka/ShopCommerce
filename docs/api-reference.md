# API Reference

REST API for ShopCommerce (NestJS). All routes are prefixed with **`/api`** (set in
[`main.ts`](../backend/src/main.ts)). Request/response bodies are JSON unless noted.

## 1. Conventions

- **Base URL** — `http://localhost:3000/api` (configurable via `PORT` / `FRONTEND_URL`).
- **Auth** — `JwtAuthGuard` is global, so **every endpoint needs `Authorization: Bearer <accessToken>`
  except those marked _Public_**. The refresh token is an `HttpOnly` cookie, not a header.
- **Validation** — global `ValidationPipe` (`whitelist: true`): unknown body fields are stripped;
  invalid input returns `400` with a `message` (string or string[]).
- **Access levels** used below:

| Level            | Meaning                                                        |
|------------------|----------------------------------------------------------------|
| **Public**       | No token required (`@Public()`).                               |
| **Auth**         | Any authenticated user.                                        |
| **Admin/Manager**| Role `admin` or `manager`.                                     |
| **Admin**        | Role `admin` only.                                             |
| **Owner**        | The resource's owner, or an admin/manager.                     |

## 2. Auth — `/api/auth`

| Method | Path          | Access | Body / notes                                              |
|--------|---------------|--------|----------------------------------------------------------|
| POST   | `/register`   | Public | `{ name, email, password }` → `{ message, accessToken }` + sets `refresh_token` cookie. Password ≥6, ≤36, ≥1 lowercase + 1 digit. |
| POST   | `/login`      | Public | `{ email, password }` → `{ message, accessToken }` + cookie. |
| POST   | `/refresh`    | Public | No body; reads `refresh_token` cookie → `{ accessToken }` + rotated cookie. |
| POST   | `/logout`     | Public | Reads cookie; deletes that refresh-token hash, clears cookie. |
| POST   | `/logout-all` | Auth   | Deletes all refresh tokens for the current user.          |
| GET    | `/me`         | Auth   | Returns the decoded JWT payload (id, email, role, name, avatar). |

## 3. Users — `/api/users`

| Method | Path         | Access       | Body / notes                                                    |
|--------|--------------|--------------|-----------------------------------------------------------------|
| GET    | `/me`        | Auth         | Current user's profile.                                         |
| PATCH  | `/me`        | Auth         | `multipart/form-data` — `UpdateUsersDto` fields + optional `file` (avatar). Password change needs `currentPassword` + `newPassword`. |
| GET    | `/`          | Admin        | List all users.                                                |
| GET    | `/:id`       | Auth (self, or admin/manager) | A user's profile.                               |
| POST   | `/`          | Auth         | `{ name, email, password, avatar?, description?, contact?, address? }`. |
| PATCH  | `/:id`       | Admin        | `multipart/form-data` — `UpdateUsersDto` + optional `file`. Admin edits any user; self-edits go through `PATCH /me`. |
| PATCH  | `/:id/role`  | Admin        | `{ role: "admin" \| "manager" \| "customer" }`. Blocks demoting the last admin.                |
| DELETE | `/:id`       | Auth (self, or admin) | Delete a user.                                        |

## 4. Products — `/api/products`

| Method | Path                      | Access        | Body / query                                             |
|--------|---------------------------|---------------|----------------------------------------------------------|
| GET    | `/`                       | Public        | Query: `search?`, `minPrice?`, `maxPrice?`, `hasDiscount?`, `rating?`, `sortBy?`, `page=1`, `limit=6`. |
| GET    | `/price`                  | Public        | Rounded `{ min, max }` price range across variants.      |
| GET    | `/:id`                    | Public        | One product.                                             |
| GET    | `/:id/stock`              | Public        | Query **required**: `size`, `color` — the matching variant. |
| GET    | `/:id/related`            | Public        | Related products.                                        |
| POST   | `/`                       | Admin/Manager | `{ title, description?, image?, rating?, numReviews? }`.  |
| POST   | `/image`                  | Admin/Manager | `multipart/form-data` `file` → uploaded image URL.       |
| POST   | `/:id/stocks`             | Admin/Manager | `{ size, color, originalPrice?, promotionPrice?, stock? }` (upsert; stock adds to existing). |
| PATCH  | `/:id/stocks/:stockId`    | Admin/Manager | `{ stock?, originalPrice?, promotionPrice? }`.            |
| PATCH  | `/:id`                    | Admin/Manager | Partial product fields.                                  |
| DELETE | `/:id`                    | Admin/Manager | Soft-delete a product.                                   |
| DELETE | `/:id/:stockId`           | Admin/Manager | Soft-delete a variant.                                        |

## 5. Comments (reviews) — `/api/comments`

| Method | Path            | Access         | Body / query                                              |
|--------|-----------------|----------------|-----------------------------------------------------------|
| POST   | `/`             | Auth           | `{ productId, content, rating }` (rating 1–5). Allowed only if eligible. |
| GET    | `/`             | Public         | Query: `productId?`, `userId?`.                           |
| GET    | `/eligibility`  | Auth           | Query **required** `productId` → `{ canReview, reason? }`. Eligible = a `delivered` order with that product. |
| GET    | `/:id`          | Public         | One comment.                                             |
| PATCH  | `/:id`          | Auth (owner)   | `{ content?, rating? }`.                                  |
| DELETE | `/:id`          | Auth (owner or admin) | Delete a comment.                                 |

## 6. Cart — `/api/carts` (all **Auth**, scoped to the current user)

| Method | Path                  | Body / notes                                  |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/`                   | Current user's cart with items.               |
| POST   | `/items`              | `{ stockId, quantity }` (quantity ≥1).        |
| PATCH  | `/items`              | `{ stockId, quantity }`.                       |
| DELETE | `/items`              | `{ stockId }` — remove one item.              |
| DELETE | `/items/all`          | Clear all items.                              |
| DELETE | `/`                   | Delete the cart.                              |
| GET    | `/items/count`        | Total item count.                             |
| GET    | `/items/minicart`     | Compact cart summary.                         |

## 7. Orders — `/api/orders`

| Method | Path                           | Access                | Body / query                                   |
|--------|--------------------------------|-----------------------|------------------------------------------------|
| POST   | `/`                            | Auth                  | `{ paymentMethod, promoCode?, deliveryFee?, address?, contact? }` — places order from the cart. |
| GET    | `/me`                          | Auth                  | Current user's orders.                         |
| GET    | `/`                            | Admin/Manager         | Query: `search?`, `status?`, `page=1`, `limit=10`, `sortBy=updatedAt`, `sortOrder=desc`. |
| GET    | `/:id`                         | Auth (owner or admin/manager) | One order.                             |
| PATCH  | `/:id`                         | Admin/Manager         | `{ status?, paymentMethod?, ... }` — status transitions validated. |
| POST   | `/:id/redelivery`              | Admin/Manager         | `{ reason, note?, address?, contact?, paymentMethod? }` — only if order is `cancelled`. |
| GET    | `/:id/redelivery`              | Auth (owner or admin/manager) | Redeliveries for an order.             |
| GET    | `/redelivery/:redeliveryId`    | Auth (owner or admin/manager) | One redelivery.                        |
| PATCH  | `/redelivery/:redeliveryId`    | Admin/Manager         | `{ status?, reason?, note?, ... }` — transitions validated. |

## 8. Promos — `/api/promos`

| Method | Path         | Access        | Body / notes                                              |
|--------|--------------|---------------|-----------------------------------------------------------|
| POST   | `/`          | Admin/Manager | `{ code, discountNum \| discountPer, maxDiscountNum?, minToApply?, expiredAt? }` (exactly one of discountNum/discountPer). |
| POST   | `/validate`  | Public        | `{ code, subtotal }` → whether the code applies and the discount. |
| GET    | `/:code`     | Public        | One promo code.                                          |
| GET    | `/`          | Admin/Manager | List all promo codes.                                    |
| PATCH  | `/`          | Admin/Manager | `UpdatePromoDto` (same shape as create; `code` identifies it). |
| DELETE | `/:code`     | Admin/Manager | Soft-delete a promo code.                                |

See [architecture.md](architecture.md) for auth internals, RBAC, and business flows.

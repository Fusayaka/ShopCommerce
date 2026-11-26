# Database

PostgreSQL scripts for the ShopCommerce database. This is the source of truth for the schema —
there are no Prisma migrations; `backend/prisma/schema.prisma` only mirrors these scripts for the
Prisma client.

## Files

| File                 | What it defines                                                        |
|----------------------|-----------------------------------------------------------------------|
| `schema.sql`         | Enums and all tables (drops existing objects first).                  |
| `functions.sql`      | `plpgsql` trigger functions.                                          |
| `trigger.sql`        | Triggers that bind those functions to tables.                        |
| `seed.sql`           | Demo data (clears all tables first).                                 |
| `schema.drawio.svg`  | Entity-relationship diagram (draw.io / SVG).                          |

## Setup

Needs `psql` and a Postgres database. First export your connection string:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/shopcommerce"
```

Then run the scripts **in this order**:

1. `psql "$DATABASE_URL" -f schema.sql` — tables + enums (drops existing data!)
2. `psql "$DATABASE_URL" -f functions.sql` — functions
3. `psql "$DATABASE_URL" -f trigger.sql` — triggers
4. `psql "$DATABASE_URL" -f seed.sql` — demo data

Or all at once:

```bash
psql "$DATABASE_URL" -f schema.sql -f functions.sql -f trigger.sql -f seed.sql
```

## Reseed data only

`seed.sql` clears all tables first, so re-run it any time to reset the data:

```bash
psql "$DATABASE_URL" -f seed.sql
```

## Schema

**Enums:**

| Enum             | Values                                                          |
|------------------|----------------------------------------------------------------|
| `item_size`      | S, M, L, XL, XXL                                                |
| `color`          | Red, Green, Blue                                               |
| `order_status`   | pending, redelivery, shipping, processing, delivered, cancelled |
| `user_role`      | admin, customer, manager                                        |
| `payment_method` | delivery, bank, card                                           |

**Tables:**

| Table               | Purpose / key columns                                                                 |
|---------------------|---------------------------------------------------------------------------------------|
| `users`             | Accounts. `role`, unique `email`; ids start at 1000.                                   |
| `refresh_tokens`    | SHA-256 hash of each refresh token (PK), `user_id`, `expires_at`. Cascade on user.     |
| `products`          | Catalog item. `rating` / `num_reviews` / `price` are derived by triggers. Soft-delete via `deleted_at`. |
| `product_stocks`    | Per-variant stock & pricing. Unique `(product_id, size, color)`. Soft-delete.          |
| `comments`          | Reviews. `rating` CHECK 1–5. Drives product rating.                                    |
| `carts`             | One per user (`user_id` UNIQUE).                                                        |
| `cart_items`        | Unique `(cart_id, stock_id)`, `quantity`.                                              |
| `orders`            | `status`, money columns; `total` is `GENERATED` (`subtotal - discount + delivery_fee`).|
| `order_items`       | Line snapshot (title/image/price). `total_price` is `GENERATED`. `stock_id` SET NULL on variant delete. |
| `promo_codes`       | `code` (PK). CHECK enforces exactly one of `discount_num` / `discount_per`. Soft-delete.|
| `redelivery_orders` | Follow-up delivery record referencing a cancelled `order_id` (for order details), with its own `status` lifecycle, `created_by`, and delivery address/contact. |

See `schema.drawio.svg` for the full relationship diagram.

## Functions & triggers

Defined in `functions.sql`, bound in `trigger.sql`:

| Trigger function              | Fires on                                              | Effect                                                                 |
|-------------------------------|------------------------------------------------------|-----------------------------------------------------------------------|
| `update_updated_at_col`       | BEFORE UPDATE on users, products, product_stocks, comments, carts, cart_items, orders | Sets `updated_at = NOW()`.                       |
| `update_product_rating`       | AFTER INSERT/UPDATE/DELETE on `comments`             | Recomputes `products.rating` (avg) and `num_reviews` (count).          |
| `update_order_status`         | BEFORE UPDATE OF `status` on `orders`                | Rejects invalid status transitions (see state machine below).         |
| `clamp_cart_items_to_stock`   | AFTER UPDATE OF `stock` on `product_stocks`          | On a stock drop, clamps cart item quantities to available, or deletes them when stock hits 0. |
| `update_product_price`        | AFTER INSERT/UPDATE OF price / DELETE on `product_stocks` | Sets `products.price` to the lowest variant price (promotion, else original). |

**Order status transitions** enforced by `update_order_status`:

```
pending    -> processing | cancelled
redelivery -> processing | cancelled
processing -> shipping   | cancelled
shipping   -> delivered  | cancelled
delivered, cancelled      (terminal)
```

> Note: `seed.sql` also recomputes `products.price`, `rating` and `num_reviews` directly, so the seeded data is correct whether or not the triggers are installed first.

> **Note:** `delivered` and `cancelled` are terminal states in `orders`. Requesting a redelivery for a `cancelled` order does **not** create a new row in `orders` — instead, it inserts a record into `redelivery_orders` referencing the cancelled `order_id` (to display original order items/totals) with its own independent `status` initialized to `redelivery`.
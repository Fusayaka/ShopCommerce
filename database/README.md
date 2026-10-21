# Database

PostgreSQL scripts for the ShopCommerce database.

## Setup

Run in this order (needs `psql` and a Postgres database):

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/shopcommerce"

psql "$DATABASE_URL" -f schema.sql     # tables + enums (drops existing data!)
psql "$DATABASE_URL" -f functions.sql  # functions
psql "$DATABASE_URL" -f trigger.sql    # triggers
psql "$DATABASE_URL" -f seed.sql       # demo data
```

Or all at once:

```bash
psql "$DATABASE_URL" -f schema.sql -f functions.sql -f trigger.sql -f seed.sql
```

## Reseed data only

`seed.sql` clears all tables first, so re-run it any time to reset the data:

```bash
psql "$DATABASE_URL" -f seed.sql
```

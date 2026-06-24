# Production schema upgrade: per-store category order

Apply this when upgrading an **existing** production database to the per-store category order feature. Existing users, products, and categories are kept. Global category `orderidx` values are **discarded**.

## Prerequisites

1. Back up the database before running any SQL.
2. Deploy the new application code immediately before or after this upgrade.
3. After upgrade, create stores in Settings and reorder categories per store in the app.

## Connect

```bash
psql "$DATABASE_URL"
```

Or with an explicit connection string from your hosting provider.

## SQL to run

Run in order:

```sql
-- 1. New tables
CREATE TABLE stores (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE category_store_order (
  store_id    INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  orderidx    INT NOT NULL,
  PRIMARY KEY (store_id, category_id),
  UNIQUE (store_id, orderidx)
);

-- 2. Remove global order column (existing orderidx data is lost)
ALTER TABLE categories DROP COLUMN orderidx;
```

## Post-deploy steps

1. Open **Settings** and create your stores (e.g. ICA, Coop).
2. Select a store on the shopping list or categories page.
3. Drag categories on the **Categories** page to set aisle order for that store.

### Optional: seed one store with alphabetical order

If you already have categories and want a starting layout before using the UI:

```sql
INSERT INTO stores (name) VALUES ('Default') RETURNING id;
-- Use the returned id below (example uses 1):

INSERT INTO category_store_order (store_id, category_id, orderidx)
SELECT 1, id, ROW_NUMBER() OVER (ORDER BY name)
FROM categories;
```

Replace `1` with the actual store id if different.

## Verify

```sql
\d categories
\d stores
\d category_store_order
```

Expected:

- `categories` has columns `id`, `name`, `color` — **no** `orderidx`
- `stores` and `category_store_order` exist

After creating a store in the app:

```bash
curl -b cookies.txt "https://your-host/__/categories?storeId=1"
```

Should return categories with per-store `orderidx` values.

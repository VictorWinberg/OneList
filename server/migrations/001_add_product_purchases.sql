-- Migration: Add product_purchases table for shopping history tracking
-- Run this migration to add the shopping history feature to an existing database

-- Create the product_purchases table
CREATE TABLE IF NOT EXISTS product_purchases (
  id            SERIAL        NOT NULL,
  product_id    INT,
  product_name  VARCHAR(255)  NOT NULL,
  category_id   INT,
  user_id       INT,
  purchased_at  TIMESTAMP     DEFAULT NOW(),

  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON product_purchases(purchased_at);
CREATE INDEX IF NOT EXISTS idx_purchases_product_name ON product_purchases(product_name);

-- Insert sample data for testing (uses existing products if available)
-- These represent historical purchases over the past few months

-- Get some product IDs dynamically and insert sample purchases
DO $$
DECLARE
  sample_products TEXT[] := ARRAY['Milk', 'Bread', 'Eggs', 'Butter', 'Cheese', 'Apples', 'Bananas', 'Chicken', 'Rice', 'Pasta'];
  product_name TEXT;
  i INT;
  days_ago INT;
BEGIN
  -- Insert sample purchases spread over the last 90 days
  FOREACH product_name IN ARRAY sample_products LOOP
    -- Each product gets purchased multiple times at different dates
    FOR i IN 1..FLOOR(RANDOM() * 8 + 3) LOOP
      days_ago := FLOOR(RANDOM() * 90);
      INSERT INTO product_purchases (product_id, product_name, category_id, user_id, purchased_at)
      SELECT
        p.id,
        product_name,
        p.category,
        1,
        NOW() - (days_ago || ' days')::INTERVAL
      FROM products p
      WHERE p.name = product_name
      UNION ALL
      SELECT
        NULL,
        product_name,
        NULL,
        1,
        NOW() - (days_ago || ' days')::INTERVAL
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = product_name)
      LIMIT 1;
    END LOOP;
  END LOOP;
END $$;

-- Verify the migration
SELECT
  'Migration complete. Product purchases table created with ' || COUNT(*) || ' sample records.' as status
FROM product_purchases;


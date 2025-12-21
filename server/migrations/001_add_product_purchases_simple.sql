-- Migration: Add product_purchases table for shopping history tracking
-- Simple version with static sample data

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

-- Insert static sample data (product_id and category_id are NULL for simplicity)
INSERT INTO product_purchases (product_name, user_id, purchased_at) VALUES
  -- Milk - bought frequently (12 times)
  ('Milk', 1, NOW() - INTERVAL '2 days'),
  ('Milk', 1, NOW() - INTERVAL '9 days'),
  ('Milk', 1, NOW() - INTERVAL '16 days'),
  ('Milk', 1, NOW() - INTERVAL '23 days'),
  ('Milk', 1, NOW() - INTERVAL '30 days'),
  ('Milk', 1, NOW() - INTERVAL '37 days'),
  ('Milk', 1, NOW() - INTERVAL '44 days'),
  ('Milk', 1, NOW() - INTERVAL '51 days'),
  ('Milk', 1, NOW() - INTERVAL '58 days'),
  ('Milk', 1, NOW() - INTERVAL '65 days'),
  ('Milk', 1, NOW() - INTERVAL '72 days'),
  ('Milk', 1, NOW() - INTERVAL '79 days'),

  -- Bread - bought frequently (10 times)
  ('Bread', 1, NOW() - INTERVAL '1 day'),
  ('Bread', 1, NOW() - INTERVAL '8 days'),
  ('Bread', 1, NOW() - INTERVAL '15 days'),
  ('Bread', 1, NOW() - INTERVAL '22 days'),
  ('Bread', 1, NOW() - INTERVAL '29 days'),
  ('Bread', 1, NOW() - INTERVAL '36 days'),
  ('Bread', 1, NOW() - INTERVAL '43 days'),
  ('Bread', 1, NOW() - INTERVAL '50 days'),
  ('Bread', 1, NOW() - INTERVAL '57 days'),
  ('Bread', 1, NOW() - INTERVAL '64 days'),

  -- Eggs - bought regularly (8 times)
  ('Eggs', 1, NOW() - INTERVAL '3 days'),
  ('Eggs', 1, NOW() - INTERVAL '13 days'),
  ('Eggs', 1, NOW() - INTERVAL '23 days'),
  ('Eggs', 1, NOW() - INTERVAL '33 days'),
  ('Eggs', 1, NOW() - INTERVAL '43 days'),
  ('Eggs', 1, NOW() - INTERVAL '53 days'),
  ('Eggs', 1, NOW() - INTERVAL '63 days'),
  ('Eggs', 1, NOW() - INTERVAL '73 days'),

  -- Butter - bought monthly (3 times)
  ('Butter', 1, NOW() - INTERVAL '5 days'),
  ('Butter', 1, NOW() - INTERVAL '35 days'),
  ('Butter', 1, NOW() - INTERVAL '65 days'),

  -- Cheese - bought regularly (6 times)
  ('Cheese', 1, NOW() - INTERVAL '4 days'),
  ('Cheese', 1, NOW() - INTERVAL '18 days'),
  ('Cheese', 1, NOW() - INTERVAL '32 days'),
  ('Cheese', 1, NOW() - INTERVAL '46 days'),
  ('Cheese', 1, NOW() - INTERVAL '60 days'),
  ('Cheese', 1, NOW() - INTERVAL '74 days'),

  -- Apples - bought regularly (5 times)
  ('Apples', 1, NOW() - INTERVAL '6 days'),
  ('Apples', 1, NOW() - INTERVAL '20 days'),
  ('Apples', 1, NOW() - INTERVAL '40 days'),
  ('Apples', 1, NOW() - INTERVAL '55 days'),
  ('Apples', 1, NOW() - INTERVAL '70 days'),

  -- Bananas - bought regularly (5 times)
  ('Bananas', 1, NOW() - INTERVAL '7 days'),
  ('Bananas', 1, NOW() - INTERVAL '21 days'),
  ('Bananas', 1, NOW() - INTERVAL '35 days'),
  ('Bananas', 1, NOW() - INTERVAL '49 days'),
  ('Bananas', 1, NOW() - INTERVAL '63 days'),

  -- Chicken - bought occasionally (4 times)
  ('Chicken', 1, NOW() - INTERVAL '10 days'),
  ('Chicken', 1, NOW() - INTERVAL '30 days'),
  ('Chicken', 1, NOW() - INTERVAL '50 days'),
  ('Chicken', 1, NOW() - INTERVAL '70 days'),

  -- Rice - bought rarely (2 times)
  ('Rice', 1, NOW() - INTERVAL '25 days'),
  ('Rice', 1, NOW() - INTERVAL '75 days'),

  -- Pasta - bought rarely (2 times)
  ('Pasta', 1, NOW() - INTERVAL '30 days'),
  ('Pasta', 1, NOW() - INTERVAL '80 days'),

  -- Coffee - bought monthly (3 times)
  ('Coffee', 1, NOW() - INTERVAL '12 days'),
  ('Coffee', 1, NOW() - INTERVAL '42 days'),
  ('Coffee', 1, NOW() - INTERVAL '72 days'),

  -- Yogurt - bought regularly (4 times)
  ('Yogurt', 1, NOW() - INTERVAL '5 days'),
  ('Yogurt', 1, NOW() - INTERVAL '19 days'),
  ('Yogurt', 1, NOW() - INTERVAL '47 days'),
  ('Yogurt', 1, NOW() - INTERVAL '61 days');

-- Verify the migration
SELECT
  'Migration complete. ' || COUNT(*) || ' purchase records created.' as status,
  COUNT(DISTINCT product_name) || ' unique products' as products,
  MIN(purchased_at)::date || ' to ' || MAX(purchased_at)::date as date_range
FROM product_purchases;


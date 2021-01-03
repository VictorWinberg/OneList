ALTER TABLE products
DROP COLUMN inactive,
DROP COLUMN checked;

DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  checked   BOOLEAN       DEFAULT FALSE,

  product   INT           NOT NULL,
  uid       INT           DEFAULT 0,

  FOREIGN KEY(product) REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY(product, uid)
);

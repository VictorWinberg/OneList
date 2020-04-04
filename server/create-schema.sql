--Create tables
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id        SERIAL        NOT NULL,
  username  VARCHAR(255)  NOT NULL,
  email     VARCHAR(255)  NOT NULL,
  photo     VARCHAR(255)  NOT NULL,
  language  VARCHAR(255)  NOT NULL,

  PRIMARY KEY (email)
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id        SERIAL        NOT NULL,
  name      VARCHAR(255)  NOT NULL UNIQUE,
  color     VARCHAR(255),
  orderidx  SERIAL        NOT NULL,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id        SERIAL        NOT NULL,
  name      VARCHAR(255)  NOT NULL UNIQUE,
  amount    DECIMAL       DEFAULT 0,
  unit      VARCHAR(50),
  inactive  BOOLEAN       DEFAULT FALSE,
  checked   BOOLEAN       DEFAULT FALSE,
  category  INT,

  FOREIGN KEY(category) REFERENCES categories(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

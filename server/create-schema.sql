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
  name      VARCHAR(255)  NOT NULL,
  color     VARCHAR(255),

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id        SERIAL        NOT NULL,
  name      VARCHAR(255)  NOT NULL,
  category  INT,

  FOREIGN KEY(category) REFERENCES categories(id) ON DELETE SET NULL,
  PRIMARY KEY(id)
);

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

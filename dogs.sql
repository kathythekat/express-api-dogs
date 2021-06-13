\echo 'Delete and recreate dogs db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS dogs;
CREATE DATABASE dogs;
\connect dogs;

CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) NOT NULL,
  breed VARCHAR(25) NOT NULL,
  age NUMERIC NOT NULL
);

DROP TABLE IF EXISTS first_list;
DROP TABLE IF EXISTS second_list;

CREATE TABLE first_list (
  id SERIAL PRIMARY KEY,
  item TEXT
);

CREATE TABLE second_list (
  id SERIAL PRIMARY KEY,
  item TEXT
);

-- Comments --
-- to show table, use "show tables"
-- INSERT INTO (table(attr1, attr2, attr3, ...)) VALUES (val1, val, val3, ...)
-- npm install express
-- install all things that we require
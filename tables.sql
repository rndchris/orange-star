CREATE TABLE menu(
	id SERIAL PRIMARY KEY,
	title TEXT,
	category TEXT,
	recipe INTEGER
);

CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
	title TEXT,
	cookTime FLOAT,
	ingredients TEXT,
	directions TEXT
);

CREATE TABLE inventory (name TEXT);

CREATE TABLE grocery_list (name TEXT);
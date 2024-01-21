CREATE TABLE menu(
	id SERIAL PRIMARY KEY,
	title TEXT,
	category TEXT,
	recipe INTEGER,
	userid INTEGER REFERENCES users(id)
);

CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
	title TEXT,
	cookTime FLOAT,
	ingredients TEXT,
	directions TEXT,
	userid INTEGER REFERENCES users(id)
);

CREATE TABLE inventory (
	name TEXT,
	userid INTEGER REFERENCES users(id)
);

CREATE TABLE grocery_list (
	name TEXT,
	userid INTEGER REFERENCES users(id)
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT UNIQUE
);
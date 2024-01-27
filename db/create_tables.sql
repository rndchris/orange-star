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
	username TEXT UNIQUE,
	last_seen TEXT
);

CREATE TABLE sessions (
	id INTEGER REFERENCES users(id),
	cookie UNIQUE TEXT,
	last_seen TEXT,
	ip_address TEXT,
	session_created TEXT
);

CREATE TABLE auth (
	id INTEGER UNIQUE REFERENCES users(id),
	salt TEXT,
	password TEXT
);

CREATE TABLE userinfo (
	id INTEGER UNIQUE REFERENCES users(id),
	dinner_hour INTEGER,
	dinner_min INTEGER
);

CREATE TABLE exchange (
	id SERIAL PRIMARY KEY,
	title TEXT,
	cookTime FLOAT,
	ingredients TEXT,
	directions TEXT,
	downloads INTEGER,
	userid INTEGER REFERENCES users(id)
);
DROP TABLE IF EXISTS games_users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_name VARCHAR(100)
);


CREATE TABLE locations (
   location_id INTEGER PRIMARY KEY AUTOINCREMENT,
   location_name VARCHAR(100),
   address VARCHAR(255)
);


CREATE TABLE games (
   game_id INTEGER PRIMARY KEY AUTOINCREMENT,
   game_name VARCHAR(100),
   location_id INT,
   FOREIGN KEY (location_id) REFERENCES locations (location_id)
);


CREATE TABLE games_users (
   game_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INT,
   game_id INT,
   FOREIGN KEY (user_id) REFERENCES users (user_id),
   FOREIGN KEY (game_id) REFERENCES games (game_id)
);
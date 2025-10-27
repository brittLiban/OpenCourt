DROP TABLE IF EXISTS games_users;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
   user_id INT AUTO_INCREMENT PRIMARY KEY,
   user_name VARCHAR(100)
)

CREATE TABLE locations (
   location_id INT AUTO_INCREMENT PRIMARY KEY,
   location_name VARCHAR(100),
   address VARCHAR(255)
);

CREATE TABLE games (
   game_id INT AUTO_INCREMENT PRIMARY KEY,
   game_name VARCHAR(100),
   location_id INT,=
   FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE games_users (
   game_user_id INT AUTO_INCREMENT PRIMARY KEY,
   game_id INT,
   user_id INT,
   FOREIGN KEY (game_id) REFERENCES games(game_id),
   FOREIGN KEY (user_id) REFERENCES users(user_id)
);
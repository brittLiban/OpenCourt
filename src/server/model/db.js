const mysql = require('mysql2')
const Database = require('better-sqlite3')
const fs = require('fs')

let db;

if (process.env.RUN_MODE === 'test' || process.env.RUN_MODE === 'cypress') {
  // Create database in memory
  let sqlite = new Database(':memory:');

  const initDb = fs.readFileSync('./test/database/initTests.sql', 'utf8');
  sqlite.exec(initDb);

  const seedDb = fs.readFileSync('./test/database/seedTests.sql', 'utf8');
  sqlite.exec(seedDb);

  // wrapper db object for sqlite
  db = {
    async query(sql, params = []) {
      const stmt = sqlite.prepare(sql);

      if (sql.trim().toLowerCase().startsWith('select')){
        return [stmt.all(params)];
      } else {
        const info = stmt.run(params);
        return [{ insertId: info.lastInsertRowid, changes: info.changes}]
      }
    },

    async end() {
      sqlite.close();
    },

    async exec(sql){
      sqlite.exec(sql);
    },

    async restart() {
      sqlite.close();

      sqlite = new Database(':memory:');
    }

  }

} else {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  }).promise();
}



module.exports = db;
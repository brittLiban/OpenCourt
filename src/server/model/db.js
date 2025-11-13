const mysql = require('mysql2');
const Database = require('better-sqlite3');
const fs = require('fs');

let db;

if (process.env.RUN_MODE === 'test' || process.env.RUN_MODE === 'cypress') {
  let sqlite = new Database(':memory:');

  const initDb = fs.readFileSync('./test/database/initTests.sql', 'utf8');
  sqlite.exec(initDb);

  const seedDb = fs.readFileSync('./test/database/seedTests.sql', 'utf8');
  sqlite.exec(seedDb);

  db = {
    async query(sql, params = []) {
      const stmt = sqlite.prepare(sql);

      if (sql.trim().toLowerCase().startsWith('select')) {
        return [stmt.all(params)];
      } else {
        const info = stmt.run(params);
        return [{ insertId: info.lastInsertRowid, changes: info.changes }];
      }
    },

    async end() {
      sqlite.close();
    },

    async exec(sql) {
      sqlite.exec(sql);
    },

    async restart() {
      sqlite.close();
      sqlite = new Database(':memory:');
    },
  };
} else {
  const pool = mysql
    .createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
    .promise();

  async function connectWithRetry(maxRetries = 20) {
    let attempt = 0;
    while (true) {
      try {
        const conn = await pool.getConnection();
        conn.release();
        console.log('Database connected successfully');
        break;
      } catch (err) {
        attempt++;
        const delay = Math.min(1000 * 2 ** Math.min(attempt, 5), 10000); // 1s → 10s
        console.error(
          `DB not ready (attempt ${attempt}/${maxRetries}): ${
            err.code || err.message
          }. Retrying in ${delay}ms...`
        );
        if (attempt >= maxRetries) throw err;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  (async () => {
    try {
      await connectWithRetry();
    } catch (err) {
      console.error('Failed to connect to DB after retries:', err);
    }
  })();

  db = pool;
}

module.exports = db;
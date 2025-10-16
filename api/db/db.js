import { Sequelize } from 'sequelize';
import chalk from 'chalk';        // only if you use chalk in logging
import 'dotenv/config'; 

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: q => console.log(chalk ? chalk.blue(`SQL Query: ${q}`) : q), 
});

export async function initDB({ runSync = false } = {}) {
  await sequelize.authenticate();
  console.log('DB connected');
  if (runSync) {
    await sequelize.sync(); 
    console.log('Models synced');
  }
  await sequelize.sync({ alter: true });
}

export default sequelize;

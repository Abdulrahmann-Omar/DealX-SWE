import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use environment variables for database connection, with fallback to hardcoded values for development or testing purposes
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_rewards',  // Database name
  process.env.DB_USER || 'postgres',      // Database user
  process.env.DB_PASS || '159',  // Database password
  {
    host: process.env.DB_HOST || 'dealx-swe-youssef-tarek-postgres-1', // Container name or host
    port: process.env.DB_PORT || 5432,       // Default Postgres port
    dialect: 'postgres',                    // Database dialect
  }
);

export default sequelize;

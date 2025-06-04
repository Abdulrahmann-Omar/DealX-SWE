import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
// Ensure this path is correct relative to where the script is run, or use absolute paths if needed.
// dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Example if .env is in root
dotenv.config(); // Assumes .env is in the backend directory or loaded globally

// Check if required environment variables are set
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is not set.`);
    process.exit(1);
  }
}

// Use environment variables for database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Ensure port is an integer
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log queries in dev
    dialectOptions: {
      // Add SSL options if required for production database connection
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false // Adjust based on your SSL certificate setup
      // }
    },
    pool: {
      max: 5, // Max number of connection in pool
      min: 0, // Min number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);

export default sequelize;

// src/lib/db.ts
import mysql from 'mysql2/promise';

// Ensure required environment variables are set
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!dbHost || !dbUser || !dbPassword || !dbName) {
  throw new Error('Database environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) must be set.');
}

// Create a connection pool
const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0, // Unlimited queue
});

// Function to get a connection from the pool
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    return connection;
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw new Error('Could not establish database connection.');
  }
}

// Optional: Test connection on startup (useful for debugging)
// (async () => {
//   let connection;
//   try {
//     connection = await getConnection();
//     console.log('Database connection test successful.');
//   } catch (error) {
//     console.error('Database connection test failed:', error);
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// })();

// Export the pool directly if preferred for transactions or direct pool usage
export { pool };

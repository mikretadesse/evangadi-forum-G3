import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,      // Maps to "localhost"
  user: process.env.DB_USER,      // Maps to "Owner"
  password: process.env.DB_PASS,  // Maps to "DwpSz7aL8iRqQljj"
  database: process.env.MYSQL_DB, // Maps to "evangadi_forum"
  port: process.env.PORT || 4000, // Maps to 4000
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
 
// Immediate test to see if it works
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    connection.release(); // Release back to pool
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error('Error Message:', err.message);
    
    // Debugging hint
    if (err.code === 'ECONNREFUSED') {
        console.error('Hint: Is your MySQL server running?');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Hint: Double check your DB_USER and DB_PASS in .env');
    }
  }
})();

export default db;




// import {Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite',
//   logging: console.log,
// });

// // Test the connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connected to SQLite database with Sequelize.');
//   })
//   .catch(err => {
//     console.error('Database connection failed:', err.message);
//   });

// export default sequelize;

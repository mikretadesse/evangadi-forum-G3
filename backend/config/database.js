import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// const db = mysql.createPool({
//    host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.MYSQL_DB,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });  
 
const db = mysql.createPool({
   host:"localhost",
  user:"myDBuser",
  // password:""
  database:"evangadi_forum",
  waitForConnections: true, 
  connectionLimit: 10,
  queueLimit: 0, 
});

//   to  Everyone
//  host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.MYSQL_DB,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });


db.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

export default db;


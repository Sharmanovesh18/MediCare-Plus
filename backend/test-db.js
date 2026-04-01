const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
    console.log("Attempting to connect with:");
    console.log("Host:", process.env.DB_HOST);
    console.log("User:", process.env.DB_USER);
    console.log("Database:", process.env.DB_NAME);
    console.log("Password Length:", process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log("✅ SUCCESS: Database connected successfully!");
        await connection.end();
    } catch (error) {
        console.error("❌ ERROR: Connection failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
    }
}

testConnection();

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function checkDatabase() {
    console.log("Connecting to:", process.env.DB_NAME);
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [tables] = await connection.query("SHOW TABLES");
        console.log("Tables in database:", tables.map(t => Object.values(t)[0]));

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            const [[{ count }]] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
            console.log(`Table '${tableName}' has ${count} records.`);
        }
    } catch (err) {
        console.error("Database check failed:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkDatabase();

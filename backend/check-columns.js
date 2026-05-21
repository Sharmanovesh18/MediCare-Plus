const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkColumns() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [columns] = await connection.query("DESCRIBE appointments");
        console.log("Columns in appointments table:");
        columns.forEach(col => {
            console.log(`- ${col.Field}: ${col.Type} (Null: ${col.Null}, Default: ${col.Default})`);
        });
    } catch (err) {
        console.error("Failed to describe table:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkColumns();

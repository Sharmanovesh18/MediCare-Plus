const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [rows] = await connection.query('SELECT DATE_FORMAT(appointment_date, "%Y-%m-%d") as appointment_date, appointment_time FROM appointments LIMIT 5');
    console.log("Appointments details:", JSON.stringify(rows, null, 2));
    await connection.end();
}
run();

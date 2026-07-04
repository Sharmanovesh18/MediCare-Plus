const db = require('../backend/config/db');

async function viewAppointments() {
    try {
        const [appointments] = await db.execute(`
            SELECT a.id, a.user_id, a.doctor_id, a.appointment_date, a.appointment_time, a.status, a.payment, a.razorpay_order_id, u.name as user_name, d.name as doctor_name
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.id DESC LIMIT 10
        `);
        console.log("Recent appointments in database:");
        console.log(JSON.stringify(appointments, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

viewAppointments();

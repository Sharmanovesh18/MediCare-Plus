const db = require('../config/db');

// Get all doctors for list
const doctorList = async (req, res) => {
    try {
        const [doctors] = await db.execute('SELECT id, name, email, specialization, experience, fees, about, image_url FROM doctors');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get doctor appointments for doctor login
const doctorAppointments = async (req, res) => {
    try {
        const docId = req.docId;
        const [appointments] = await db.execute(`
            SELECT 
                a.*, u.name as user_name, u.email as user_email
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.doctor_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [docId]);
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get booked slots for a specific doctor (public/patient-facing)
const getBookedSlots = async (req, res) => {
    try {
        const { docId } = req.params;
        const [appointments] = await db.execute(
            'SELECT DATE_FORMAT(appointment_date, "%Y-%m-%d") as appointment_date, appointment_time FROM appointments WHERE doctor_id = ? AND status != "Cancelled"',
            [docId]
        );
        res.json({ success: true, bookedSlots: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { doctorList, doctorAppointments, getBookedSlots };


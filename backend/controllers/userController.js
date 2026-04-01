const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        const id = result.insertId;
        const token = jwt.sign({ id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        
        // Prevent double booking
        const [existing] = await db.execute(
            'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "Cancelled"',
            [docId, slotDate, slotTime]
        );

        if (existing.length > 0) {
            return res.json({ success: false, message: "Slot already booked" });
        }

        const [result] = await db.execute(
            'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [userId, docId, slotDate, slotTime]
        );

        res.json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get list of appointments for patient
const listAppointments = async (req, res) => {
    try {
        const { userId } = req.body;
        const [appointments] = await db.execute(`
            SELECT 
                a.*, d.name as doctor_name, d.specialization as doctor_specialization, d.image_url as doctor_image
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [userId]);
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const [result] = await db.execute(
            'UPDATE appointments SET status = "Cancelled" WHERE id = ? AND user_id = ?',
            [appointmentId, userId]
        );
        res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser, bookAppointment, listAppointments, cancelAppointment };

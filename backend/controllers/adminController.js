const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// API to login admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET); // Using the format expected by the middleware
            res.json({ success: true, token, role: 'admin' });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to add doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, fees, about, slots_booked, image } = req.body;
        if (!name || !email || !password || !specialization || experience === '' || fees === '' || !about) {
            return res.json({ success: false, message: "Missing details" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO doctors (name, email, password, specialization, experience, fees, about, availability, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, specialization, experience, fees, about, slots_booked || '{}', image || '']
        );

        res.json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get all doctors
const allDoctors = async (req, res) => {
    try {
        const [doctors] = await db.execute('SELECT id, name, email, specialization, experience, fees, about, image_url FROM doctors');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get appointments for admin dashboard
const appointmentsAdmin = async (req, res) => {
  try {
    const [appointments] = await db.execute(`
      SELECT 
        a.id, a.appointment_date, a.appointment_time, a.status,
        u.name as user_name, u.email as user_email,
        d.name as doctor_name, d.specialization as doctor_specialization
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { loginAdmin, addDoctor, allDoctors, appointmentsAdmin };

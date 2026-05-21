const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

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
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Missing Appointment Details" });
        }

        // Convert slotTime to 24-hour HH:MM:SS format for MySQL TIME column
        let dbTime = slotTime;
        if (slotTime) {
            const timeMatch = slotTime.toUpperCase().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
            if (timeMatch) {
                let [ , hours, minutes, modifier ] = timeMatch;
                if (hours === "12") {
                    hours = "00";
                }
                if (modifier === "PM") {
                    hours = (parseInt(hours, 10) + 12).toString();
                }
                dbTime = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
            }
        }

        const numericDocId = parseInt(docId, 10);
        
        // Prevent double booking
        const [existing] = await db.execute(
            'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "Cancelled"',
            [numericDocId, slotDate, dbTime]
        );

        if (existing.length > 0) {
            return res.json({ success: false, message: "Slot already booked" });
        }

        const [result] = await db.execute(
            'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)',
            [userId, numericDocId, slotDate, dbTime]
        );

        res.json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

// Get list of appointments for patient
const listAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const [appointments] = await db.execute(`
            SELECT 
                a.*, d.name as doctor_name, d.specialization as doctor_specialization, d.image_url as doctor_image, d.fees as doctor_fees
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
        const { appointmentId } = req.body;
        const userId = req.userId;
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

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const [appointments] = await db.execute(`
            SELECT a.*, d.fees, d.name as doctor_name, u.email as user_email, u.name as user_name
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ?
        `, [appointmentId]);
        
        const appointmentData = appointments[0];

        if (!appointmentData || appointmentData.status === 'Cancelled') {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        const origin = req.headers.origin || 'http://localhost:5173';
        
        // Ensure amount is at least 50 INR (5000 paise) to prevent Stripe India errors
        const finalAmount = Math.max(appointmentData.fees, 50);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: appointmentData.user_email,
            billing_address_collection: 'required',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Appointment with Dr. ${appointmentData.doctor_name}`,
                            description: `Appointment Payment for ${appointmentData.user_name}`,
                        },
                        unit_amount: finalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/payment-success?success=true&appointmentId=${appointmentId}`,
            cancel_url: `${origin}/payment-success?success=false&appointmentId=${appointmentId}`,
        });
        
        // Save the stripe session id. We repurpose the razorpay_order_id column to avoid schema changes.
        await db.execute('UPDATE appointments SET razorpay_order_id = ? WHERE id = ?', [session.id, appointmentId]);

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Stripe Error: ", error.message || error);
        res.json({ success: false, message: error.message || "Payment Gateway Error" });
    }
};

// API to verify payment of Stripe
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;

        if (success === "true" || success === true) {
            const [appointments] = await db.execute('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
            const appointmentData = appointments[0];

            if (appointmentData && appointmentData.razorpay_order_id) {
                // Verify with Stripe
                const session = await stripe.checkout.sessions.retrieve(appointmentData.razorpay_order_id);
                if (session.payment_status === 'paid') {
                    await db.execute('UPDATE appointments SET payment = TRUE, status = "Confirmed" WHERE id = ?', [appointmentId]);
                    return res.json({ success: true, message: "Payment Successful" });
                }
            }
        }
        res.json({ success: false, message: "Payment Failed" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const [users] = await db.execute('SELECT id, name, email, phone, address, gender, dob FROM users WHERE id = ?', [userId]);
        const userData = users[0];
        res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, gender, dob } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        await db.execute(
            'UPDATE users SET name = ?, phone = ?, address = ?, gender = ?, dob = ? WHERE id = ?',
            [name, phone || null, address || null, gender || null, dob || null, userId]
        );

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser, bookAppointment, listAppointments, cancelAppointment, paymentStripe, verifyStripe, getProfile, updateProfile };

const dotenv = require('dotenv');
// Always load environment variables first!
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mysql = require('mysql2/promise');

async function testStripePayment() {
    console.log("Testing Stripe Integration...");
    console.log("Stripe Secret Key prefix:", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + "..." : "None");
    
    let connection;
    try {
        // Find a valid appointment with a doctor to construct a realistic session
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [appointments] = await connection.query(`
            SELECT a.id, d.fees, d.name as doctor_name, u.email as user_email, u.name as user_name
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            JOIN users u ON a.user_id = u.id
            LIMIT 1
        `);

        if (appointments.length === 0) {
            console.log("⚠️ No appointments found in database. Cannot run integrated session test.");
            return;
        }

        const appointment = appointments[0];
        console.log(`Found appointment ID ${appointment.id} with Dr. ${appointment.doctor_name} for ${appointment.user_name} (${appointment.user_email}). Fee: ${appointment.fees}`);

        const finalAmount = Math.max(appointment.fees, 50);

        console.log("Creating Stripe Checkout Session...");
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: appointment.user_email,
            billing_address_collection: 'required',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Appointment with Dr. ${appointment.doctor_name}`,
                            description: `Appointment Payment for ${appointment.user_name}`,
                        },
                        unit_amount: finalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/my-appointments?success=true&appointmentId=${appointment.id}`,
            cancel_url: `http://localhost:5173/my-appointments?success=false&appointmentId=${appointment.id}`,
        });

        console.log("✅ SUCCESS: Stripe Checkout Session created successfully!");
        console.log("Session ID:", session.id);
        console.log("Session URL (Live Link):", session.url);

    } catch (error) {
        console.error("❌ ERROR: Stripe integration test failed!");
        console.error("Error Message:", error.message || error);
    } finally {
        if (connection) await connection.end();
    }
}

testStripePayment();

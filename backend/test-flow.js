const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

async function testFullFlow() {
    console.log("=== STARTING FULL END-TO-END FLOW API TEST ===");
    console.log("Target Server URL:", BASE_URL);

    const randomId = Math.floor(Math.random() * 1000000);
    const email = `patient.${randomId}@example.com`;
    const password = "password123";
    const name = `Test Patient ${randomId}`;

    let token = "";
    let appointmentId = null;

    // 1. REGISTER
    try {
        console.log("\n1. Testing User Registration...");
        const res = await axios.post(`${BASE_URL}/api/user/register`, { name, email, password });
        if (res.data.success) {
            token = res.data.token;
            console.log("✅ Registration Successful!");
            console.log("Token:", token.substring(0, 20) + "...");
        } else {
            console.error("❌ Registration returned success=false:", res.data);
            return;
        }
    } catch (err) {
        console.error("❌ Registration API failed:", err.response?.data || err.message);
        return;
    }

    // 2. LOGIN
    try {
        console.log("\n2. Testing User Login...");
        const res = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
        if (res.data.success) {
            console.log("✅ Login Successful!");
        } else {
            console.error("❌ Login returned success=false:", res.data);
            return;
        }
    } catch (err) {
        console.error("❌ Login API failed:", err.response?.data || err.message);
        return;
    }

    // 3. BOOK APPOINTMENT
    try {
        console.log("\n3. Testing Appointment Booking...");
        const testDate = new Date();
        testDate.setDate(testDate.getDate() + 2 + Math.floor(Math.random() * 200));
        const slotDate = testDate.toISOString().split('T')[0];
        const slotTime = "11:30 AM";

        const res = await axios.post(`${BASE_URL}/api/user/book-appointment`, 
            { docId: 1, slotDate, slotTime }, 
            { headers: { token } }
        );

        if (res.data.success) {
            console.log("✅ Appointment Booking Successful!");
            console.log("Message:", res.data.message);
        } else {
            console.error("❌ Appointment Booking returned success=false:", res.data);
            return;
        }
    } catch (err) {
        console.error("❌ Appointment Booking API failed:", err.response?.data || err.message);
        return;
    }

    // 4. RETRIEVE APPOINTMENTS & FIND ID
    try {
        console.log("\n4. Retrieving Booked Appointments...");
        const res = await axios.get(`${BASE_URL}/api/user/appointments`, { headers: { token } });
        if (res.data.success) {
            const appointments = res.data.appointments;
            console.log(`✅ Retrieved ${appointments.length} appointments.`);
            if (appointments.length > 0) {
                appointmentId = appointments[0].id;
                console.log("New Appointment ID:", appointmentId);
            } else {
                console.error("❌ No appointments retrieved even after successful booking.");
                return;
            }
        } else {
            console.error("❌ Retrieving appointments returned success=false:", res.data);
            return;
        }
    } catch (err) {
        console.error("❌ Retrieving appointments API failed:", err.response?.data || err.message);
        return;
    }

    // 5. INITIATE STRIPE PAYMENT
    try {
        console.log("\n5. Testing Stripe Payment Initiation...");
        const res = await axios.post(`${BASE_URL}/api/user/payment-stripe`, 
            { appointmentId }, 
            { headers: { token } }
        );

        if (res.data.success) {
            console.log("✅ Stripe Payment Initiation Successful!");
            console.log("Payment Session URL:", res.data.session_url);
        } else {
            console.error("❌ Stripe Payment returned success=false:", res.data);
            return;
        }
    } catch (err) {
        console.error("❌ Stripe Payment API failed:", err.response?.data || err.message);
        return;
    }

    console.log("\n=== ✅ ALL END-TO-END API TESTS PASSED SUCCESSFULLY! ===");
}

testFullFlow();

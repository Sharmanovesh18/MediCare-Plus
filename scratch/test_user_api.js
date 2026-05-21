const axios = require('axios');

async function testApi() {
    const backendUrl = 'http://localhost:5000';
    try {
        // Register a test user
        const email = `test_${Date.now()}@test.com`;
        const regRes = await axios.post(`${backendUrl}/api/user/register`, {
            name: 'Test User',
            email: email,
            password: 'password123'
        });
        
        const token = regRes.data.token;
        console.log('Registered token:', token);
        
        // Fetch appointments
        const appRes = await axios.get(`${backendUrl}/api/user/appointments`, {
            headers: { token }
        });
        console.log('Appointments:', JSON.stringify(appRes.data, null, 2));
        
        // Fetch profile
        const profRes = await axios.get(`${backendUrl}/api/user/get-profile`, {
            headers: { token }
        });
        console.log('Profile:', JSON.stringify(profRes.data, null, 2));
        
    } catch (error) {
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
    }
}

testApi();

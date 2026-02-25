const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifyBackend() {
    console.log('--- Verifying Backend APIs ---');

    try {
        // 1. Check if server is running
        const health = await axios.get('http://localhost:5000/');
        console.log('✅ Server Health:', health.data);

        // 2. Try to register a test user
        const reg = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        }).catch(e => ({ status: e.response?.status, data: e.response?.data }));

        if (reg.status === 201 || reg.status === 400) {
            console.log('✅ Auth API: Functional (or user exists)');
        } else {
            console.log('❌ Auth API: Error', reg.data);
        }

        console.log('--- Verification Complete ---');
    } catch (error) {
        console.log('❌ Verification Failed: Ensure server is running with "npm run start" in /server');
    }
}

verifyBackend();

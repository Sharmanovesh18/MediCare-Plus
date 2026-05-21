const db = require('../backend/config/db');

async function listDoctors() {
    try {
        const [doctors] = await db.execute('SELECT id, name, image_url FROM doctors');
        console.log(JSON.stringify(doctors, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listDoctors();

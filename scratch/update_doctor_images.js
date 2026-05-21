const db = require('../backend/config/db');

async function updateDoctorImages() {
    try {
        const [doctors] = await db.execute('SELECT id, specialization FROM doctors');
        
        for (const doc of doctors) {
            let imageUrl = '';
            switch (doc.specialization) {
                case 'General Physician':
                case 'General physician':
                    imageUrl = '/doctors/general_physician.png';
                    break;
                case 'Gynecologist':
                    imageUrl = '/doctors/gynecologist.png';
                    break;
                case 'Dermatologist':
                    imageUrl = '/doctors/dermatologist.png';
                    break;
                case 'Pediatricians':
                case 'Pediatrician':
                    imageUrl = '/doctors/pediatrician.png';
                    break;
                case 'Neurologist':
                    imageUrl = '/doctors/neurologist.png';
                    break;
                case 'Gastroenterologist':
                    imageUrl = '/doctors/gastroenterologist.png';
                    break;
                default:
                    imageUrl = '/doctors/general_physician.png';
            }
            
            await db.execute('UPDATE doctors SET image_url = ? WHERE id = ?', [imageUrl, doc.id]);
            console.log(`Updated doctor ${doc.id} (${doc.specialization}) with image ${imageUrl}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

updateDoctorImages();

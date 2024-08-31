// utils/fetchServiceInfo.ts
import { getDatabase, ref, get } from 'firebase/database';

const fetchServiceInfo = async (serviceId: string) => {
    const db = getDatabase();
    const serviceRef = ref(db, `services/${serviceId}`);
    try {
        const snapshot = await get(serviceRef);
        if (snapshot.exists()) {
            return snapshot.val(); // Devuelve la información del servicio
        } else {
            throw new Error('No service data found');
        }
    } catch (error) {
        console.error('Error fetching service info:', error);
        throw error;
    }
};

export default fetchServiceInfo;

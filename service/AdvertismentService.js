
import baseUrl  from '@/utils/baseUrl';

export const AdvertismentService = {
    getadvertisment(token) {
        return fetch(`${baseUrl}/advertisement`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

  

    
};

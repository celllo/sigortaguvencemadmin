
import baseUrl  from '@/utils/baseUrl';

export const OrdersService = {
    getorders(page,size, token) {
        return fetch(`${baseUrl}/orders?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    
};

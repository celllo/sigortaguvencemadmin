
import baseUrl  from '@/utils/baseUrl';

export const DiscountService = {
    getdiscounts(token) {
        return fetch(`${baseUrl}/productdiscount`, { headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    
};

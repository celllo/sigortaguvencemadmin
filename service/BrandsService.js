
import baseUrl  from '@/utils/baseUrl';

export const BrandsService = {
    getbrands(token) {
        
        return fetch(`${baseUrl}/productbrand`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },


    getbrandswithname(name,token) {
        
        return fetch(`${baseUrl}/productbrand?name=${encodeURIComponent(name)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getbrandswithid(id,token) {
        
        return fetch(`${baseUrl}/productbrand?id=${encodeURIComponent(id)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    
};

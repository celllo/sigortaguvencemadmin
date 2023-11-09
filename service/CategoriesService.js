
import baseUrl  from '@/utils/baseUrl';

export const CategoriesService = {
    getcategories(token) {
        return fetch(`${baseUrl}/categories`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getallcategories(token) {
        return fetch(`${baseUrl}/categories/allcategories`, { headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}`} })
            .then((res) => res.json())
            .then((d) => d);
    },

    
};

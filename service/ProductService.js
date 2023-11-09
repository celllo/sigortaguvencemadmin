import baseUrl  from '@/utils/baseUrl';


export const ProductService = {
    getproducts(page,size,token) {
        

        return fetch(`${baseUrl}/products?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getproductswithid(id,token) {

        return fetch(`${baseUrl}/products/id?id=${encodeURIComponent(id)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },
};

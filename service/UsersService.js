
import baseUrl  from '@/utils/baseUrl';

export const UsersService = {
    getusers(page,size,name,token) {
        if(name == null){
            name = "";
        }
        return fetch(`${baseUrl}/users?identityNumber=${encodeURIComponent(name)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`, { headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },
    getuserisadmin(token) {
        
        return fetch(`${baseUrl}/users/isadmin`, { headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getaddresswithuser(id,token) {
       
        return fetch(`${baseUrl}/addresses?id=${encodeURIComponent(id)}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getproductwithname(page,size,name,token) {
       
        return fetch(`${baseUrl}/products?name=${encodeURIComponent(name)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getuserswithid(id,token) {
        
        return fetch(`${baseUrl}/users/${encodeURIComponent(id)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },


  

    
};

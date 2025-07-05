
import baseUrl  from '@/utils/baseUrl';

export const UsersService = {
    getusers(page,size,tc,name,order,token) {
        if(name == null){
            name = "";
        }
        var url = "";
        if(order == null){
            url = `${baseUrl}/users?identityNumber=${encodeURIComponent(tc)}&name=${encodeURIComponent(name)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
        }else{
            

            

            url = `${baseUrl}/users?identityNumber=${encodeURIComponent(name)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}&orderlist=${JSON.stringify(order.code)}`;
        }
        return fetch(url, { headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}` } })
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

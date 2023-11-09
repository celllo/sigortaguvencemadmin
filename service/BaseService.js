
import baseUrl  from '@/utils/baseUrl';

export const BaseService = {
    get(url,token) {
      
            return fetch(`${url}`,
            
            { 
            method: "GET",    
             headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
         },

         put(url,body,token) {
      
            return fetch(`${url}`,
            
            { 
                method: "PUT",  
                body:  body,  
         headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }})
            .then((res) => res.json())
            .then((d) => d);
         },

         post(url,body,token) {
      
            return fetch(`${url}`,
            
            { 
                method: "POST",  
                body:  body, 
            headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
         },

         delete(url,token) {
      
            return fetch(`${url}`,
            
            { 
                method: "DELETE",    
    headers: { 'Cache-Control': 'no-cache' , "Authorization": `Bearer ${token}` }  })
            .then((res) => res.json())
            .then((d) => d);
         },
         deletewithbody(url,body,token) {
      
            return fetch(`${url}`,
            
            {         
               body:  body, 

                method: "DELETE",    
    headers: { 'Cache-Control': 'no-cache' , 'Content-Type': 'application/json',"Authorization": `Bearer ${token}` }  })
            .then((res) => res.json())
            .then((d) => d);
         },

         upload(formData,token) {
      
            return fetch(`${baseUrl}/file`,
            
            { 
                body: formData,
    
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` }  })
            .then((res) => res.json())
            .then((d) => d);
         }

    
       
    

  

    
};

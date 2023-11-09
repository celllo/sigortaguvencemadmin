
import baseUrl  from '@/utils/baseUrl';

export const ConfigsService = {
    
    getConfigs(token) {


        return fetch(`${baseUrl}/configs`, { headers: { 'Cache-Control': 'no-cache',"Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },


    getCountries(name,token) {


        return fetch(`${baseUrl}/country?name=${encodeURIComponent(name)}`, { headers: { 'Cache-Control': 'no-cache',"Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    
    getDistricts(id,token) {


        return fetch(`${baseUrl}/districts?CityId=${encodeURIComponent(id)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
        .then((res) => res.json())
        .then((d) => d);
    },

   

    
};
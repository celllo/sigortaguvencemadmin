
import baseUrl  from '@/utils/baseUrl';

export const DashboardService = {
   
    getdashboard(token) {
        
        return fetch(`${baseUrl}/dashboard`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getdashboardwithdate(start,end,token) {
        
        return fetch(`${baseUrl}/dashboard?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

   

    
};

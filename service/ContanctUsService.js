
import baseUrl  from '@/utils/baseUrl';

export const ContactUsService = {
    getMessages(token) {
        return fetch(`${baseUrl}/contactus`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getMessageTypes(token) {
        return fetch(`${baseUrl}/contactustypes`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getSocials(token) {
        return fetch(`${baseUrl}/socials`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    getNotifs(token) {
        return fetch(`${baseUrl}/notifs`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },
    getfaq(code,token) {
        return fetch(`${baseUrl}/faq?code=${encodeURIComponent(code)}`, { headers: { 'Cache-Control': 'no-cache', "Authorization": `Bearer ${token}` } })
            .then((res) => res.json())
            .then((d) => d);
    },

    
};
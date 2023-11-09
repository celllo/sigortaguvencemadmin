import { cookies } from 'next/headers'



export default async function setcookies   (title,data)  {
    cookies().set(title, data, { secure: true })



}
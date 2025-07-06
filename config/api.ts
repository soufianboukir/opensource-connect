import axios from "axios";


const getBaseUrl = ():string =>{
    const baseUrl:string = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';
    return baseUrl;
}


export const api = axios.create({
    baseURL:getBaseUrl()
})
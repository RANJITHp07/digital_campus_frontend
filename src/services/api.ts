import axios from "axios";
import Cookies from "js-cookie";

const cookies = Cookies.get('accessToken') as string;

const cleanedJwt = cookies ? cookies.replace(/"/g, '') : '';

const Api = axios.create({
    // baseURL: "https://www.digitalcampus.shop",
    baseURL:"http://localhost:4000",
    headers: {
        Authorization: cleanedJwt || ''
    }
});

export default Api;

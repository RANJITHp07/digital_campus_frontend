import axios from "axios";
import Cookies from "js-cookie";

const cookies = Cookies.get('accessToken') as string;
const cleanedJwt = cookies.replace(/"/g, '');

const Api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        Authorization: cleanedJwt || ''
    }
});

export default Api;

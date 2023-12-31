import axios from "axios";
import Cookies from "js-cookie";

const cookies = Cookies.get('accessToken');
console.log(cookies);

const Api = axios.create({
    baseURL: "https://www.digitalcampus.shop",
    headers: {
        Authorization: cookies || ''
    }
});

export default Api;

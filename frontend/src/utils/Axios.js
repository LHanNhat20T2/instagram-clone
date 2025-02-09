import { baseUrl } from "@/utils/SummaryApi";
import axios from "axios";

const Axios = axios.create({
    baseURL: "https://api-ecom.duthanhduoc.com/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default Axios;

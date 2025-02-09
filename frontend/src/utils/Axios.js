import { baseUrl } from "@/utils/SummaryApi";
import axios from "axios";

const Axios = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default Axios;

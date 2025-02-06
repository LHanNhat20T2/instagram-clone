import { baseUrl } from "@/utils/SummaryApi";
import axios from "axios";

const Axios = axios.create({
    baseURL: baseUrl, // Base URL cho tất cả các API
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Nếu bạn cần cookies hoặc token cho mỗi yêu cầu
});

export default Axios;

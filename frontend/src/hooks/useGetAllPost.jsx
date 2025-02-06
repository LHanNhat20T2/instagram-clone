import { setPosts } from "@/redux/postSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await Axios({ ...SummaryApi.getPost });
                if (res.data.success) {
                    console.log(res.data);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPost();
    }, [dispatch]);
};
export default useGetAllPost;

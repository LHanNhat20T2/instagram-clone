import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await Axios({
                    ...SummaryApi.allMessage(selectedUser._id),
                });
                if (res.data.success) {
                    dispatch(setMessages(res.data.message));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllMessage();
    }, [selectedUser, dispatch]);
};
export default useGetAllMessage;

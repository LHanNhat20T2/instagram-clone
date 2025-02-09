import { setSuggestedUsers } from "@/redux/authSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await Axios({ ...SummaryApi.suggestedUsers });
                if (res.data.success) {
                    // console.log(res.data);
                    dispatch(setSuggestedUsers(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSuggestedUsers();
    }, [dispatch]);
};
export default useGetSuggestedUsers;

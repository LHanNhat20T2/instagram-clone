import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUsersProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await Axios({
                    ...SummaryApi.getUserProfile(userId),
                });
                if (res.data.success) {
                    console.log("user", res.data);
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserProfile();
    }, [userId, dispatch]);
};
export default useGetUsersProfile;

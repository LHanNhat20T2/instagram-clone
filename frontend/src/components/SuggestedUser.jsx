import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleFollowUser } from "@/redux/authSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SuggestedUser = () => {
    const { suggestedUsers, user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const handleFollowOrUnfollow = async (userId) => {
        try {
            const res = await Axios({ ...SummaryApi.followOrUnfollow(userId) });
            if (res.data.success) {
                dispatch(toggleFollowUser(userId));
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    return (
        <div className="my-10">
            <div className="flex items-center justify-between text-sm">
                <h1 className="font-semibold text-gray-600">Gợi ý</h1>
                <span className="font-medium cursor-pointer">Xem tất cả</span>
            </div>
            {suggestedUsers.length > 0 &&
                suggestedUsers.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center justify-between my-5"
                    >
                        <div className="flex items-center gap-2">
                            <Link to={`/profile/${user._id}`}>
                                <Avatar>
                                    <AvatarImage
                                        src={user.profilePicture}
                                        alt="img"
                                    />
                                    <AvatarFallback>
                                        {user.username.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <h1 className="text-sm font-semibold">
                                    <Link to={`/profile/${user._id}`}>
                                        {user.username}
                                    </Link>
                                </h1>
                                <span className="text-sm text-gray-600">
                                    {user.bio || "Bio here..."}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleFollowOrUnfollow(user._id)}
                            className={`ml-10 font-bold cursor-pointer text-sm 
                                ${
                                    user.isFollowing
                                        ? "text-gray-500"
                                        : "text-blue-500"
                                } hover:opacity-80`}
                        >
                            {user.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                        </button>
                    </div>
                ))}
        </div>
    );
};

export default SuggestedUser;

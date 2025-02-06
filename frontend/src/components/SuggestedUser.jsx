import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
    const { suggestedUsers } = useSelector((store) => store.auth);
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
                        <div className="flex items-center justify-between gap-2">
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar>
                                    <AvatarImage
                                        src={user?.profilePicture}
                                        alt="img"
                                    />
                                    <AvatarFallback>HN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <h1 className="text-sm font-semibold">
                                    <Link to={`/profile/${user?._id}`}>
                                        {user?.username}
                                    </Link>
                                </h1>
                                <span className="text-sm text-gray-600">
                                    {user?.bio || "Bio here..."}
                                </span>
                            </div>
                        </div>
                        <span className="ml-10 font-bold cursor-pointer text-priBl text-sx hover:text-blue-500">
                            Theo dõi
                        </span>
                    </div>
                ))}
        </div>
    );
};
export default SuggestedUser;

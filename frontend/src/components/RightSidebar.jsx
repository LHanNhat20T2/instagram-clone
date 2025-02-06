import SuggestedUser from "@/components/SuggestedUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightSidebar = () => {
    const { user } = useSelector((store) => store.auth);
    return (
        <div className="my-10 w-fit pr-36">
            <div className="flex items-center gap-2">
                <Link to={`/profile/${user._id}`}>
                    <Avatar>
                        <AvatarImage
                            src={user?.profilePicture}
                            alt="post_image"
                        />
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="">
                    <h1 className="text-sm font-semibold">
                        <Link to={`/profile/${user?._id}`}>
                            {user?.username}
                        </Link>
                    </h1>
                    <span className="text-sm text-gray-600">
                        {user?.bio || "Web dev"}
                    </span>
                </div>
            </div>
            <SuggestedUser />
        </div>
    );
};
export default RightSidebar;

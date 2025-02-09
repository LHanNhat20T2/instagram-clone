import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetUsersProfile from "@/hooks/useGetUserProfile";
import { AtSign, Heart } from "lucide-react";
import { useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUsersProfile(userId);
    const { userProfile, user } = useSelector((store) => store.auth);
    const [activeTab, setActiveTab] = useState("posts");

    // console.log(userProfile);
    const isLoggedInUserProfile = user?._id === userProfile?._id;
    const isFollowing = false;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const displayedPost =
        activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
    return (
        <div className="flex justify-center max-w-5xl pl-10 mx-auto">
            <div className="flex flex-col gap-10 p-8">
                <div className="grid gap-20 p-8 grid-cols">
                    <div className="grid grid-cols-2">
                        <section className="flex items-center justify-center ">
                            <Avatar className="w-36 h-36">
                                <AvatarImage
                                    className="w-full"
                                    src={userProfile?.profilePicture}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </section>
                        <section>
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2">
                                    <span>{userProfile?.username}</span>
                                    {isLoggedInUserProfile ? (
                                        <>
                                            <Link to="/account/edit">
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 hover:bg-gray-200"
                                                >
                                                    Chỉnh sửa trang cá nhân
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="secondary"
                                                className="h-8 hover:bg-gray-200"
                                            >
                                                Xem kho lưu trữ
                                            </Button>
                                        </>
                                    ) : isFollowing ? (
                                        <>
                                            <Button
                                                variant="secondary"
                                                className="h-8"
                                            >
                                                Bỏ theo dõi
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="h-8"
                                            >
                                                Nhắn tin
                                            </Button>
                                        </>
                                    ) : (
                                        <Button className="bg-priBl hover:bg-blue-500">
                                            Theo dõi
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 ">
                                    <p>
                                        <span className="mr-2 font-semibold">
                                            {userProfile?.posts.length}
                                        </span>
                                        bài viết
                                    </p>
                                    <p>
                                        <span className="mr-2 font-semibold">
                                            {userProfile?.followers.length}
                                        </span>
                                        theo dõi
                                    </p>
                                    <p>
                                        <span className="mr-2 font-semibold">
                                            {userProfile?.following.length}
                                        </span>
                                        bỏ theo dõi
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">
                                        {userProfile?.bio || ""}
                                    </span>
                                    <Badge
                                        className="w-fit"
                                        variant="secondary"
                                    >
                                        <AtSign className="pl-1"></AtSign>
                                        <span>{userProfile?.username}</span>
                                    </Badge>
                                    <span>
                                        💭Everything happens for a reason🌱
                                    </span>
                                </div>
                            </div>
                        </section>
                        <div className="col-span-2 mt-6 border-t border-t-gray-200">
                            <div className="flex items-center justify-center gap-10 text-sm">
                                <span
                                    className={`py-3 cursor-pointer uppercase ${
                                        activeTab == "posts" ? "font-bold" : ""
                                    }`}
                                    onClick={() => handleTabChange("posts")}
                                >
                                    Bài viết
                                </span>
                                <span
                                    className={`py-3 cursor-pointer uppercase ${
                                        activeTab == "Đã lưu" ? "font-bold" : ""
                                    }`}
                                    onClick={() => handleTabChange("Đã lưu")}
                                >
                                    Đã lưu
                                </span>
                                <span
                                    className={`py-3 cursor-pointer uppercase ${
                                        activeTab == "Được gắn thẻ"
                                            ? "font-bold"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleTabChange("Được gắn thẻ")
                                    }
                                >
                                    Được gắn thẻ
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                {displayedPost?.map((post) => (
                                    <div
                                        key={post?._id}
                                        className="relative cursor-pointer group"
                                    >
                                        <img
                                            src={post.image}
                                            alt="postImage"
                                            className="object-cover w-full my-2 rounded-sm aspect-square"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100">
                                            <div className="flex items-center space-x-4 text-white">
                                                <button className="flex items-center gap-2 hover:text-gray-300">
                                                    <Heart />
                                                    <span>
                                                        {post?.likes.length}
                                                    </span>
                                                </button>
                                                <button className="flex items-center gap-2 hover:text-gray-300">
                                                    <LuMessageCircle />
                                                    <span>
                                                        {post?.comments.length}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;

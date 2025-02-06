import CreatePost from "@/components/CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import {
    Compass,
    Heart,
    Home,
    LogOut,
    PlusSquare,
    Search,
    Send,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await Axios.get(SummaryApi.logout.url);
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === "Đăng xuất") {
            logoutHandler();
        } else if (textType === "Tạo") {
            setOpen(true);
        } else if (textType === "Trang cá nhân") {
            navigate(`/profile/${user?._id}`);
        }
    };
    const sidebarItem = [
        {
            icon: <Home />,
            text: "Trang chủ",
        },
        {
            icon: <Search />,
            text: "Tìm kiếm",
        },
        {
            icon: <Compass />,
            text: "Khám phá",
        },
        {
            icon: <Send />,
            text: "Tin nhắn",
        },
        {
            icon: <Heart />,
            text: "Thông báo",
        },
        {
            icon: <PlusSquare />,
            text: "Tạo",
        },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Trang cá nhân",
        },
        {
            icon: <LogOut />,
            text: "Đăng xuất",
        },
    ];
    return (
        <div className="left-0 fixed top-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen">
            <div className="flex flex-col">
                <h1 className="my-8 ml-6 text-2xl font-bold">Instagram</h1>
                {sidebarItem.map((item, index) => (
                    <div
                        onClick={() => sidebarHandler(item.text)}
                        key={index}
                        className="relative flex items-center gap-3 p-3 my-3 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};
export default LeftSidebar;

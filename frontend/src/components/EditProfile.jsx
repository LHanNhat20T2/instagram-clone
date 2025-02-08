import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SummaryApi from "@/utils/SummaryApi";
import Axios from "@/utils/Axios";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
const EditProfile = () => {
    const { user } = useSelector((store) => store.auth);
    const imageRef = useRef();
    const [loading, setLoading] = useState();
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender,
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {
        console.log("input", input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await Axios({
                ...SummaryApi.editProfile,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender,
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex max-w-2xl pl-10 mx-auto mt-12">
            <section className="flex flex-col w-full gap-6">
                <h1 className="text-xl font-bold">Chỉnh sửa trang cá nhân</h1>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={user?.profilePicture}
                                alt="post_image"
                            />
                            <AvatarFallback>HN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-sm font-bold">
                                <Link to={`/profile/${user?._id}`}>
                                    {user?.username}
                                </Link>
                            </h1>
                            <span className="text-gray-600 ">
                                {user?.bio || "Web dev"}
                            </span>
                        </div>
                    </div>
                    <input
                        onChange={fileChangeHandler}
                        ref={imageRef}
                        type="file"
                        className="hidden"
                    />
                    <Button
                        onClick={() => imageRef?.current.click()}
                        className="h-8 bg-priBl hover:bg-blue-500"
                    >
                        Thay đổi ảnh
                    </Button>
                </div>
                <div>
                    <h1 className="mb-2 text-xl font-bold">Tiểu sử</h1>
                    <Textarea
                        value={input.bio}
                        onChange={(e) =>
                            setInput({ ...input, bio: e.target.value })
                        }
                        className="resize-none focus-visible:ring-transparent"
                    ></Textarea>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Giới tính</h1>
                    <Select
                        defaultValue={input.gender}
                        onValueChange={selectChangeHandler}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    {loading ? (
                        <div className="ml-auto min-w-[250px]">
                            <Button className="w-full py-4 bg-priBl hover:bg-blue-500">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin">
                                    Đang tải
                                </Loader2>
                            </Button>
                        </div>
                    ) : (
                        <div className="ml-auto min-w-[250px]">
                            <Button
                                onClick={editProfileHandler}
                                className="w-full py-4 bg-priBl hover:bg-blue-500"
                            >
                                Gửi
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
export default EditProfile;

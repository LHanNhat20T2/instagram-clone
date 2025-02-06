import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuthUser } from "@/redux/authSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            // Sử dụng axiosInstance đã tạo
            const res = await Axios.post(SummaryApi.register.url, input);

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/login");
                toast.success(res.data.message);
            }

            // Cập nhật state sau khi đăng ký thành công
            setInput({
                username: "",
                email: "",
                password: "",
            });
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            // Xử lý lỗi ở đây nếu cần
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen mt-20">
            <form
                onSubmit={signupHandler}
                className="flex flex-col gap-5 p-8 shadow-lg"
            >
                <div>
                    <h1 className="text-5xl font-bold text-center">
                        Instagram
                    </h1>
                    <p className="mt-4 text-base">
                        Đăng ký để xem ảnh và video từ bạn bè.
                    </p>
                </div>
                <div className="text-left">
                    <Label className="text-base font-medium">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={handleEventHandler}
                        className="my-2 focus-visible:ring-transparent"
                    />
                </div>
                <div className="text-left ">
                    <Label className="text-base font-medium">Email</Label>
                    <Input
                        type="text"
                        className="my-2 focus-visible:ring-transparent"
                        name="email"
                        value={input.email}
                        onChange={handleEventHandler}
                    />
                </div>
                <div className="text-left">
                    <Label className="text-base font-medium">Password</Label>
                    <Input
                        type="password"
                        className="my-2 focus-visible:ring-transparent"
                        name="password"
                        value={input.password}
                        onChange={handleEventHandler}
                    />
                </div>
                <p className="max-w-[260px] text-xs">
                    Những người dùng dịch vụ của chúng tôi có thể đã tải thông
                    tin liên hệ của bạn lên Instagram.{" "}
                    <a href="#!" className="text-blue-900">
                        Tìm hiểu thêm
                    </a>
                </p>
                <p className="max-w-[260px] text-xs">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <a href="#!" className="text-blue-900">
                        Điều khoản, Chính sách quyền riêng tư{" "}
                        <span className="text-black">và</span> Chính sách
                    </a>{" "}
                    cookie của chúng tôi.
                </p>
                {loading ? (
                    <Button>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tải
                    </Button>
                ) : (
                    <Button className="bg-priBl">Đăng ký</Button>
                )}

                <p className="text-sm text-center">
                    Bạn chưa có tài khoản ư?{" "}
                    <Link to="/login" className="font-medium text-blue-400">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
};
export default Signup;

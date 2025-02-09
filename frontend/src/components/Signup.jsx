import { Button } from "@/components/ui/button";
import { setAuthUser } from "@/redux/authSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/ValidationSchema";
import InputField from "@/components/InputField";

const Signup = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const signupHandler = async (data) => {
        try {
            const res = await Axios({ ...SummaryApi.register }, data);

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/login");
                toast.success(res.data.message);
                reset();
            }
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            toast.error("Có lỗi xảy ra, hãy thử lại!");
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center w-screen mt-20">
            <form
                onSubmit={handleSubmit(signupHandler)}
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

                <InputField
                    label="Tên người dùng"
                    type="text"
                    name="username"
                    register={register}
                    errors={errors}
                    placeholder="Tên"
                />

                <InputField
                    label="Email"
                    type="text"
                    name="email"
                    register={register}
                    errors={errors}
                    placeholder="Email"
                />

                <InputField
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    register={register}
                    errors={errors}
                    placeholder="Mật khẩu"
                />

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

                <Button
                    type="submit"
                    className="bg-priBl"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang tải...
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </Button>

                <p className="text-sm text-center">
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login" className="font-medium text-blue-400">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;

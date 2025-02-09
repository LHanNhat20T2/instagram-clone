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
import { loginSchema } from "@/utils/ValidationSchema";
import InputField from "@/components/InputField";

const Login = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const loginHandler = async (data) => {
        try {
            const res = await Axios({ ...SummaryApi.login, data });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                reset();
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            toast.error("Sai tài khoản hoặc mật khẩu, hãy thử lại!");
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center mt-20">
            <form
                onSubmit={handleSubmit(loginHandler)}
                className="flex flex-col gap-5 p-8 shadow-lg"
            >
                <div>
                    <h1 className="text-5xl font-bold text-center">
                        Instagram
                    </h1>
                    <p className="mt-4 text-base">
                        Đăng nhập để xem ảnh và video từ bạn bè.
                    </p>
                </div>

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
                        "Đăng nhập"
                    )}
                </Button>

                <p className="text-sm text-center">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/signup" className="font-medium text-blue-400">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

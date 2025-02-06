import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CreatePost = ({ open, setOpen }) => {
    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async () => {
        if (!caption.trim() && !file) {
            toast.error("Vui lòng nhập nội dung hoặc chọn ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        if (file) formData.append("image", file);

        console.log("file gui le", formData.get("image"));

        try {
            setLoading(true);
            // const res = await Axios.post(SummaryApi.createPost.url, formData, {
            //     // const res = await Axios(
            //     //     { ...SummaryApi.createPost, formData },
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            const res = await Axios({
                ...SummaryApi.createPost,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
                setCaption("");
                setFile("");
                setImagePreview("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="font-semibold text-center">
                    Tạo mới bài viết
                </DialogHeader>
                <DialogTitle></DialogTitle>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={user?.profilePicture}
                            alt="img"
                        ></AvatarImage>
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xs font-semibold">
                            {user?.username}
                        </h1>
                        {/* <span className="text-xs text-gray-600">Noi dung</span> */}
                    </div>
                </div>
                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="border-none resize-none focus-visible:ring-transparent"
                    placeholder="Viết nội dung"
                />
                {imagePreview && (
                    <div className="flex items-center justify-center w-full h-64">
                        <img
                            src={imagePreview}
                            alt="preview-img"
                            className="object-cover w-full h-full rounded-md"
                        />
                    </div>
                )}
                <input
                    ref={imageRef}
                    type="file"
                    className="hidden"
                    onChange={fileChangeHandler}
                />
                <Button
                    onClick={() => imageRef.current.click()}
                    className="mx-auto w-fit bg-priBl hover:bg-blue-500 "
                >
                    Chọn từ máy tính
                </Button>
                {imagePreview &&
                    (loading ? (
                        <Button>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        </Button>
                    ) : (
                        <Button
                            className="w-full hover:bg-blue-500 "
                            onClick={createPostHandler}
                            type="submit"
                        >
                            Đăng
                        </Button>
                    ))}
            </DialogContent>
        </Dialog>
    );
};
// props type

CreatePost.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};
export default CreatePost;

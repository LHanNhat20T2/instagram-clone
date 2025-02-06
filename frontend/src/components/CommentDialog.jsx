import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "@/components/Comment";
import { toast } from "sonner";
import SummaryApi from "@/utils/SummaryApi";
import Axios from "@/utils/Axios";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector((store) => store.post);
    const [comment, setComment] = useState(selectedPost?.comments);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments);
        }
    }, [selectedPost]);
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    const sendMessageHandler = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.addComment(selectedPost?._id),
                data: { text },
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]; // Đổi res.data.message thành res.data.comment
                setComment(updatedCommentData);

                // Tạo updatedPostData đúng cách
                const updatedPostData = posts.map((p) =>
                    p._id === selectedPost._id
                        ? { ...p, comments: updatedCommentData }
                        : p
                );

                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };
    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className="flex flex-col max-w-5xl p-0"
            >
                <DialogTitle></DialogTitle>
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            src={selectedPost?.image}
                            alt="post-img"
                            className="object-cover w-full h-full rounded-l-lg "
                        />
                    </div>
                    <div className="flex flex-col justify-between w-1/2">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Link to="">
                                    <Avatar>
                                        <AvatarImage
                                            src={
                                                selectedPost?.author
                                                    ?.profilePicture
                                            }
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link
                                        to=""
                                        className="text-xs font-semibold"
                                    >
                                        {selectedPost?.author?.username}
                                    </Link>
                                    {/* <span className="text-xs text-gray-600">
                                    </span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center py-4 text-sm text-center">
                                    <div className="w-full pb-4 font-bold text-red-500 border-b border-gray-400 cursor-pointer ">
                                        Bỏ theo dõi
                                    </div>
                                    <div className="w-full cursor-pointer ">
                                        Thêm vào yêu thích
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className="flex-1 p-4 overflow-y-auto max-h-96">
                            {(comment ?? []).map((comment) => (
                                <Comment key={comment._id} comment={comment} />
                            ))}
                        </div>
                        <hr />
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <input
                                    value={text}
                                    onChange={changeEventHandler}
                                    type="text"
                                    placeholder="Bình luận"
                                    className="w-full p-2 rounded outline-none"
                                />
                                <Button
                                    disabled={!text.trim()}
                                    onClick={sendMessageHandler}
                                    variant="outline"
                                    className="border-none hover:bg-none hover:text-blue-800"
                                >
                                    Đăng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default CommentDialog;

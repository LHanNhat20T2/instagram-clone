import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from "react";
import CommentDialog from "@/components/CommentDialog";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import SummaryApi from "@/utils/SummaryApi";
import Axios from "@/utils/Axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    // console.log("Post comments:", post.comments);
    const [isFollowing, setIsFollowing] = useState(
        post.author?.followers?.includes(user?._id) || false
    );
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    const likeOrDisLikeHandler = async () => {
        try {
            const apiCall = liked
                ? SummaryApi.dislikePost(post?._id)
                : SummaryApi.likePost(post?._id);

            // Gọi API
            const res = await Axios({ ...apiCall });

            if (res.data.success) {
                const updateLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updateLikes);
                setLiked(!liked);

                const updatePostData = posts.map((p) =>
                    p._id === post._id
                        ? {
                              ...p,
                              likes: !liked
                                  ? [...p.likes, user._id]
                                  : p.likes.filter((id) => id !== user._id),
                          }
                        : p
                );

                dispatch(setPosts(updatePostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await Axios({ ...SummaryApi.deletePost(post?._id) });
            if (res.data.success) {
                const updatePostData = posts.filter(
                    (postItem) => postItem?._id !== post?._id
                );
                dispatch(setPosts(updatePostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    const handleFollowOrUnfollow = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.followOrUnfollow(post.author?._id),
            });
            if (res.data.success) {
                setIsFollowing(!isFollowing);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const commentHandler = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.addComment(post?._id),
                data: { text },
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]; // Đổi res.data.message thành res.data.comment
                setComment(updatedCommentData);

                // Tạo updatedPostData đúng cách
                const updatedPostData = posts.map((p) =>
                    p._id === post._id
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

    const bookmarkHandler = async () => {
        try {
            const res = await Axios({ ...SummaryApi.bookMark(post?._id) });
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };
    // console.log("Comment Data:", comment);
    // console.log("Comment length:", comment.length);

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={post.author?.profilePicture}
                            alt="post_image"
                        />
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author?._id && (
                            <Badge variant="second">Tác giả</Badge>
                        )}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <DialogTitle></DialogTitle>
                        {post?.author?._id !== user?._id && (
                            <Button
                                variant="ghost"
                                className="cursor-pointer w-fit text-[#ED3967] font-bold"
                                onClick={handleFollowOrUnfollow}
                            >
                                {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                            </Button>
                        )}

                        <Separator className="" />
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-fit "
                        >
                            Thêm vào mục yêu thích
                        </Button>
                        <Separator className="" />
                        {user && user?._id === post?.author._id && (
                            <Button
                                onClick={deletePostHandler}
                                variant="ghost"
                                className="cursor-pointer w-fit "
                            >
                                Xóa
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className="object-cover w-full my-2 border-gray-900 border-solid rounded-sm aspect-square"
                src={post.image}
                alt={post.author?.username}
            />
            <div className="">
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center gap-3">
                        {liked ? (
                            <FaHeart
                                onClick={likeOrDisLikeHandler}
                                size={24}
                                className="text-red-600 cursor-pointer"
                            />
                        ) : (
                            <FaRegHeart
                                onClick={likeOrDisLikeHandler}
                                size={24}
                                className="cursor-pointer hover:text-gray-600"
                            />
                        )}
                        <LuMessageCircle
                            onClick={() => {
                                dispatch(setSelectedPost(post));
                                setOpen(true);
                            }}
                            size={24}
                            className="cursor-pointer hover:text-gray-600"
                        />
                        <Send
                            size={24}
                            className="cursor-pointer hover:text-gray-600"
                        />
                    </div>
                    <FaRegBookmark
                        onClick={bookmarkHandler}
                        size={24}
                        className="cursor-pointer hover:text-gray-600"
                    />
                </div>
                <span className="block mb-2 font-medium">
                    {postLike} lượt thích
                </span>
                <p>
                    <span className="mr-2 font-medium">
                        {post.author?.username} <span>{post.caption}</span>
                    </span>
                </p>
                {comment.length > 0 && (
                    <span
                        onClick={() => {
                            // console.log("Selected Post:", post);
                            dispatch(
                                setSelectedPost({ ...post, comments: comment })
                            );
                            setOpen(true);
                        }}
                        className="text-sm text-gray-400 cursor-pointer"
                    >
                        Xem tất cả {comment.length} bình luận
                    </span>
                )}
                <CommentDialog open={open} setOpen={setOpen} />
                <div className="flex items-start justify-between">
                    <input
                        type="text"
                        placeholder="Bình luận"
                        className="w-full text-sm outline-none"
                        value={text}
                        onChange={changeEventHandler}
                    />
                    {text && (
                        <span
                            onClick={commentHandler}
                            className="font-medium cursor-pointer text-priBl hover:text-blue-800"
                        >
                            Đăng
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// props type
Post.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        author: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            profilePicture: PropTypes.string,
            followers: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
        caption: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        likes: PropTypes.arrayOf(PropTypes.string),
        comments: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                text: PropTypes.string.isRequired,
                author: PropTypes.shape({
                    _id: PropTypes.string.isRequired,
                    username: PropTypes.string,
                    profilePicture: PropTypes.string,
                }).isRequired,
            })
        ),
    }).isRequired,
};

export default Post;

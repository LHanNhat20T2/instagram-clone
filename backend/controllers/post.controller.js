import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js"; //
import { Comment } from "../model/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image || !image.buffer) {
            return res.status(400).json({
                success: false,
                message: "Ảnh không hợp lệ hoặc bị thiếu",
            });
        }

        // Resize & optimize ảnhss
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // Upload lên Cloudinary
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
            "base64"
        )}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
        });
        // Cập nhật danh sách bài viết của user
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: "author", select: "-password" });

        // Trả về phản hồi thành công
        return res.status(201).json({
            success: true,
            message: "Đăng bài thành công",
            post,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username, profilePicture",
                },
            });

        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profilePicture",
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture",
                },
            });

        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Bài viết k tìm thấy",
                success: false,
            });
        }

        // like logic
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        return res.status(200).json({
            message: "Bài viết đã like",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Thích bài viết",
                success: false,
            });
        }

        // like logic
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        return res.status(200).json({
            message: "Hủy thích bài viết",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.id;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!text)
            return res
                .status(400)
                .json({ message: "Bắt buộc", success: false });
        const comment = await Comment.create({
            text,
            author: commentId,
            post: postId,
        });
        await comment.populate({
            path: "author",
            select: "username profilePicture",
        });

        post.comments.push(comment._id);
        await post.save();
        return res.status(200).json({
            message: "Bình luận thành công",
            comment,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({
            post: postId,
        }).populate({
            author: "username profilePicture",
        });
        if (!comments) {
            return res.status(404).json({
                message: "Không có bình luận trong bài viết",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({
                message: "Không tìm thấy bài viết",
                success: false,
            });
        //check owner bai viet;
        if (post.author.toString() !== authorId)
            return res.status(403).json({
                message: "Chưa xác thực",
            });

        //delete post
        await Post.findByIdAndDelete(postId);

        // remove post id;
        let user = await User.findById(authorId);
        user.posts = user.posts.filter((id) => id.toString() !== postId);
        await user.save();

        // delete comment
        await Comment.deleteMany({ post: postId });
        return res.status(200).json({
            success: true,
            message: "Bài viết đã xóa",
        });
    } catch (error) {
        console.log(error);
    }
};

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post)
            return res
                .status(404)
                .json({ messagE: "Bài viết k tìm thấy", success: false });
        const user = await User.findById(authorId);
        if (user.bookmarks.includes(authorId)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: "Không lưu",
                message: "Bài viết đã xóa",
                success: true,
            });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: "Lưu",
                message: "Đã lưu bài viết",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

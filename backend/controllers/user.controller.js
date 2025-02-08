import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Lỗi, vui lòng kiểm tra lại",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Thử lại email khác",
                success: false,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashPassword,
        });
        return res.status(201).json({
            message: "Tạo tài khoản thành công",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Email và mật khẩu là bắt buộc",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Thử lại email khác",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Sai email hoặc password",
                success: false,
            });
        }
        const token = await jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        const populatePosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        };

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Chào ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.log(error);
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Đăng xuất thành công",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({ path: "posts", options: { sort: { createdAt: -1 } } })
            .populate("bookmarks");
        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "Người dùng k tìm thấy",
                success: false,
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({
            message: "Cập nhật thành công",
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        // loai bo chu ng dung`
        const suggestedUser = await User.find({
            _id: { $ne: req.id },
        }).select("-password");
        if (!suggestedUser) {
            return res.status(400).json({
                message: "Không có người dùng",
            });
        }

        return res.status(200).json({
            success: true,
            user: suggestedUser,
        });
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.id; // ID của người dùng hiện tại
        const targetUserId = req.params.id; // ID của người dùng muốn theo dõi/bỏ theo dõi
        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(400).json({
                message: "Bạn không thể theo dõi hoặc bỏ theo dõi chính mình",
                success: false,
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(400).json({
                message: "Người dùng không tìm thấy",
                success: false,
            });
        }

        const isFollowing = currentUser.following.includes(targetUserId);
        if (isFollowing) {
            //unfollow
            await Promise.all([
                User.updateOne(
                    { _id: currentUserId },
                    { $pull: { following: targetUserId } }
                ),
                User.updateOne(
                    { _id: targetUserId },
                    { $pull: { followers: currentUserId } }
                ),
            ]);
            return res
                .status(200)
                .json({ message: "Bỏ theo dõi thành công", success: true });
        } else {
            await Promise.all([
                User.updateOne(
                    { _id: currentUserId },
                    { $push: { following: targetUserId } }
                ),
                User.updateOne(
                    { _id: targetUserId },
                    { $push: { followers: currentUserId } }
                ),
            ]);
            return res
                .status(200)
                .json({ message: "Theo dõi thành công", success: true });
        }
    } catch (error) {
        console.log(error);
    }
};

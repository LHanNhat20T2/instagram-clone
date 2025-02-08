import { Conversation } from "../model/conversation.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import { Message } from "../model/message.model.js";
import mongoose from "mongoose"; //

export const sendMessage = async (req, res) => {
    try {
        const senderId = new mongoose.Types.ObjectId(req.id); //
        const receiverId = new mongoose.Types.ObjectId(req.params.id);

        const { textMessage: message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // socket
        const receiverSocketId = getReceiverSocketId(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (error) {
        console.log("Lỗi khi gửi tin nhắn:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = new mongoose.Types.ObjectId(req.id);
        const receiverId = new mongoose.Types.ObjectId(req.params.id);

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation)
            return res.status(200).json({ success: true, message: [] });

        return res
            .status(200)
            .json({ success: true, message: conversation.messages });
    } catch (error) {
        console.log("Lỗi khi lấy tin nhắn:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

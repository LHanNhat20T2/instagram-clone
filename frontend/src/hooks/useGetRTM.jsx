import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { io } from "socket.io-client";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const messages = useSelector((store) => store.chat.messages || []); // Đảm bảo messages luôn là mảng
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        if (user) {
            socketRef.current = io("https://hannhat-ins.onrender.com/", {
                query: { userId: user._id },
                transports: ["websocket"],
            });

            socketRef.current.on("newMessage", (newMessage) => {
                dispatch(setMessages([...messages, newMessage])); // Đảm bảo truyền vào mảng, không phải function
            });

            return () => {
                socketRef.current?.disconnect();
                socketRef.current = null;
            };
        }
    }, [user, dispatch, messages]); // messages trong dependency để luôn cập nhật đúng dữ liệu

    return socketRef;
};

export default useGetRTM;

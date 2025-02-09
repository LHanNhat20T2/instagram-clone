import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { io } from "socket.io-client";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const messages = useSelector((store) => store.chat.messages || []);
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        if (user) {
            socketRef.current = io("https://hannhat-ins.onrender.com", {
                query: { userId: user._id },
                transports: ["websocket"],
            });

            socketRef.current.on("newMessage", (newMessage) => {
                dispatch(setMessages([...messages, newMessage]));
            });

            return () => {
                socketRef.current?.disconnect();
                socketRef.current = null;
            };
        }
    }, [user, dispatch, messages]);

    return socketRef;
};

export default useGetRTM;

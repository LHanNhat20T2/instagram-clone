import Message from "@/components/Message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSelectedUser } from "@/redux/authSlice";
import { setMessages } from "@/redux/chatSlice";
import Axios from "@/utils/Axios";
import SummaryApi from "@/utils/SummaryApi";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(
        (store) => store.auth
    );
    const { onlineUsers, messages } = useSelector((store) => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await Axios({
                ...SummaryApi.sendMessage(receiverId),
                data: { textMessage },
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);
    return (
        <div className="flex ml-[16%] h-screen">
            <section className="w-full my-8 md:w-1/4">
                <h1 className="px-3 mb-4 text-xl font-bold">
                    {user?.username}
                </h1>
                <hr className="mb-4 border-gray-300" />
                <div className="overflow-y-auto h-[80vh]">
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(
                            suggestedUser?._id
                        );
                        return (
                            <div
                                key={suggestedUser?._id}
                                onClick={() =>
                                    dispatch(setSelectedUser(suggestedUser))
                                }
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                            >
                                <Avatar className="w-14 h-14">
                                    <AvatarImage
                                        src={suggestedUser?.profilePicture}
                                    />
                                    <AvatarFallback>HN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span>{suggestedUser?.username}</span>
                                    <span
                                        className={`text-xs font-bold ${
                                            isOnline
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {isOnline ? "online" : "offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className="flex flex-col flex-1 h-full border-l border-l-gray-300">
                    <div className="sticky top-0 z-10 flex items-center gap-3 px-3 py-2 bg-white border-b border-gray-300">
                        <Avatar className="w-14 h-14">
                            <AvatarImage
                                src={selectedUser?.profilePicture}
                                alt="profile"
                            />
                            <AvatarFallback>HN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Message selectedUser={selectedUser} />
                    <div className="flex items-center p-4 border-t border-t-gray-300">
                        <Input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            type="text"
                            className="flex-1 mr-2 focus-visible:ring-transparent"
                            placeholder="Nhắn tin..."
                        />
                        <Button
                            onClick={() =>
                                sendMessageHandler(selectedUser?._id)
                            }
                        >
                            Gửi
                        </Button>
                    </div>
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center mx-auto">
                    <MessageCircle className="w-32 h-32 my-4" />
                    <h1 className="font-medium">Tin nhắn của bạn</h1>
                    <span>Gửi tin nhắn bắt đầu một đoạn chát</span>
                </div>
            )}
        </div>
    );
};
export default ChatPage;

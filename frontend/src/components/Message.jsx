import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Message = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages = [] } = useSelector((store) => store.chat);
    const { user } = useSelector((store) => store.auth);
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center">
                    <Avatar>
                        <AvatarImage
                            src={selectedUser?.profilePicture}
                            alt="profile"
                        />
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">
                            Xem trang cá nhân
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {Array.isArray(messages) &&
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${
                                msg.senderId === user?._id
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`p-2 rounded-lg max-w-xs break-words ${
                                    msg.senderId === user?._id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-black"
                                }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
Message.propTypes = {
    selectedUser: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
    }).isRequired,
};

export default Message;

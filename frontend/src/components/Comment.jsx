import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
const Comment = ({ comment }) => {
    return (
        <div className="my-2">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>HN</AvatarFallback>
                </Avatar>
                <h1>
                    {comment?.author.username}
                    <span className="pl-1 font-normal">{comment?.text}</span>
                </h1>
            </div>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        author: PropTypes.shape({
            username: PropTypes.string,
            profilePicture: PropTypes.string,
        }).isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
};
export default Comment;

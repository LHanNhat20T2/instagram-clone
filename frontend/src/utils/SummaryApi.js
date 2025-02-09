export const baseUrl = "https://hannhat-ins.onrender.com";

const SummaryApi = {
    register: {
        url: "/api/v1/user/register",
        method: "post",
    },
    login: {
        url: "/api/v1/user/login",
        method: "post",
    },
    logout: {
        url: "/api/v1/user/logout",
        method: "get",
    },
    createPost: {
        url: "/api/v1/post/addpost",
        method: "post",
    },
    getPost: {
        url: "/api/v1/post/all",
        method: "get",
    },
    deletePost: (id) => ({
        url: `/api/v1/post/delete/${id}`,
        method: "delete",
    }),
    likePost: (id) => ({
        url: `/api/v1/post/${id}/like`,
        method: "get",
    }),
    dislikePost: (id) => ({
        url: `/api/v1/post/${id}/dislike`,
        method: "get",
    }),
    addComment: (id) => ({
        url: `/api/v1/post/${id}/comment`,
        method: "post",
    }),
    suggestedUsers: {
        url: "/api/v1/user/suggested",
        method: "get",
    },
    getUserProfile: (id) => ({
        url: `/api/v1/user/${id}/profile`,
        method: "get",
    }),
    editProfile: {
        url: "/api/v1/user/profile/edit",
        method: "post",
    },
    followOrUnfollow: (id) => ({
        url: `/api/v1/user/followorunfollow/${id}`,
        method: "post",
    }),
    sendMessage: (id) => ({
        url: `/api/v1/message/send/${id}`,
        method: "post",
    }),
    allMessage: (id) => ({
        url: `/api/v1/message/all/${id}`,
        method: "get",
    }),
    bookMark: (id) => ({
        url: `/api/v1/post/${id}/bookmark`,
        method: "post",
    }),
};
export default SummaryApi;

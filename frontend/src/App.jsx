import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/components/Home";
import MainLayout from "@/components/MainLayout";
import Profile from "@/components/Profile";
import EditProfile from "@/components/EditProfile";
import ChatPage from "@/components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setOnlineUsers } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/rtnSlice";
import ProtectedRoutes from "@/components/ProtectedRoutes";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoutes>
                <MainLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoutes>
                        <Home />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "/profile/:id",
                element: (
                    <ProtectedRoutes>
                        <Profile />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "/account/edit",
                element: (
                    <ProtectedRoutes>
                        <EditProfile />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "/chat",
                element: (
                    <ProtectedRoutes>
                        <ChatPage />
                    </ProtectedRoutes>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);
function App() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const socketRef = useRef(null);

    useEffect(() => {
        if (user) {
            socketRef.current = io("https://hannhat-ins.onrender.com/", {
                query: { userId: user?._id },
                transports: ["websocket"],
            });

            socketRef.current.on("getOnlineUsers", (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            });

            socketRef.current.on("notification", (notification) => {
                console.log("notifi", notification);
                dispatch(setLikeNotification(notification));
            });

            return () => {
                socketRef.current?.disconnect();
                socketRef.current = null;
            };
        }
    }, [user, dispatch]);

    return <RouterProvider router={browserRouter} />;
}

export default App;

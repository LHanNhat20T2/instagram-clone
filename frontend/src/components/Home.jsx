import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import { Outlet } from "react-router-dom";

const Home = () => {
    useGetSuggestedUsers();
    useGetAllPost();
    console.log(":home log");
    return (
        <div className="flex">
            <div className="flex-grow">
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    );
};
export default Home;

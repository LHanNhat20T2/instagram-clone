import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);
    return <div>{children}</div>;
};
ProtectedRoutes.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;

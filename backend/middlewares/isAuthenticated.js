import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Người dùng chưa xác thực",
                success: false,
            });
        }

        // giai ma
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Lỗi",
                success: false,
            });
        }
        // luu token

        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
};

export default isAuthenticated;

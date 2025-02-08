import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

console.log(process.env.PORT);
const __dirname = path.resolve();
console.log(__dirname);

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
    return res.status(200).json({
        message: "I'm coming from backend",
        success: true,
    });
});

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corOptions = {
    origin: process.env.URL,
    credentials: true,
};

app.use(cors(corOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});

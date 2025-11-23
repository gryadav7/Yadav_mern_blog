import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/Auth.route.js";
import UserRoute from "./routes/User.route.js";
import CategoryRoute from "./routes/Category.route.js";
import BlogRoute from "./routes/Blog.route.js";
import CommentRoute from "./routes/Comment.route.js";
import BlogLikeRoute from "./routes/Bloglike.route.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// request logger (so you SEE each call)
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// mount ONLY your real routes (no dummy app.post here!)
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/blog-like", BlogLikeRoute);

// error handler
app.use((err, req, res, _next) => {
  console.error("❌ Error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server error" });
});

// start
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONN); // <-- connects to Atlas
    console.log("✅ Mongo connected to DB:", mongoose.connection.name);
    mongoose.set("debug", true); // shows Mongo queries
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  } catch (e) {
    console.error("Mongo connection failed:", e);
    process.exit(1);
  }
};

start();

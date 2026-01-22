import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";

import cors from "cors";
import connectMongoDB from "./config/mongoose-config.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import protectedRoute from "./middlewares/protectedroute.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

const app = express();
const _dirname = path.resolve();
connectMongoDB();


// middlewares

app.use(cors(
  {
  origin: "http://localhost:5173",
    credentials: true,
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






//api routes
app.use("/api/auth", authRoutes);
app.use("/api/expense", protectedRoute, expenseRoutes);
app.use("/api/Users", protectedRoute, userRoutes);
app.use("/api/", protectedRoute, groupRoutes);
app.use("/api/balances", protectedRoute, groupRoutes);


app.use(express.static(path.join(_dirname, "/Frontend/dist")));
app.use((req, res) => {
  res.sendFile(
    path.resolve(__dirname, "Frontend", "dist", "index.html")
  )
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

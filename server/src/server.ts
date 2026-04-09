import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import accountsRoutes from "./routes/accounts.routes.js";
import goalsRoutes from "./routes/goals.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./config/db.js";

const app = express();
const port = process.env.PORT;

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: process.env.URL, credentials: true }));

connectDB();

app.use("/api", authRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", accountsRoutes);
app.use("/api", goalsRoutes);
app.use("/api", transactionRoutes);
app.use("/api", adminRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

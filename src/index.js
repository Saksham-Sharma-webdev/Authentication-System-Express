import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./db/db.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

dotenv.config();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
  res.send("Auth API is running.");
});

const startServer = async () => {
  try {
    await db();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.log("❌ Failed to connect...", err.message);
    process.exit(1);
  }
};

startServer();

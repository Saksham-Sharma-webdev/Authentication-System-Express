import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import db from "./utils/db.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

dotenv.config()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authentication"],
  })
);

app.use('/api/users',userRoutes)

app.use('/', (req, res) => {
  console.log("Welcome to Auth server.")
  res.send('Thanks for visiting.')
})


const startServer = async () => {
  await db();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
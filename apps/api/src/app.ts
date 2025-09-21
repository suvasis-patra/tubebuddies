import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/users");

export default app;

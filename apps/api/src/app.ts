import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundErrorHandler } from "./controllers/error.controller";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use(notFoundErrorHandler);
app.use(errorHandler);

export default app;

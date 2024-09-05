/** @format */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

// import developersRouter from "./routes/developer.routes.js";
// app.use("/api/v1/developer", developersRouter);
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

export { app };

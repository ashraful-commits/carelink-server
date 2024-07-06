import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";

import { errorHandler } from "./api/middlewares/errorHandler.js";

import cookiesParser from "cookie-parser"
import privetRouter from './api/routes/privetRouter.js';
import { MongoDBCnncetion } from './api/config/mongoDBConncetion.js';

//===============================================> dotenv config
dotenv.config();
//===============================================> evn
const port = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173","https://carelink-solutions.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("api/public"));
app.use(cookiesParser())

//================================================> routes
app.use("/api/v1/auth", privetRouter);
app.use(errorHandler);
//================================================> create server
app.listen(port, () => {
  MongoDBCnncetion();
  console.log(`Server running on port ${port}`.bgCyan.yellow);
});

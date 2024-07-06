import express from "express";

import { tokenVerify } from "../middlewares/TokenVerify.js";
import { registerUser,userLogin,me,logoutUser } from './../controllers/authcontroler.js';

const privetRouter = express.Router();


privetRouter.route("/register").post(registerUser);
privetRouter.route("/login").post(userLogin);
privetRouter.route("/me").get(tokenVerify,me);
privetRouter.route("/logout").post(logoutUser);

export default privetRouter;

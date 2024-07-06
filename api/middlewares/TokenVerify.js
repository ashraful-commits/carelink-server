import jwt from "jsonwebtoken";
import asyencHandeler from "express-async-handler";
import UserModel from "../model/UserModel.js";

export const tokenVerify = (req, res, next) => {
  // const token = req.headers.authorization || req.headers.Authorization;
const accessToken = req.cookies.accessToken

  if (!accessToken) {
   return res.status(404).json({ message: "not authorize" });
  } 

    jwt.verify(
      accessToken,
      process.env.JWT_SECRECT,
      asyencHandeler(async (err, decode) => {
        err && res.status(404).json({ message: "Not user" });

        const me = await UserModel.findOne({ email: decode?.email }).select().populate("role");
        req.me = me;
        next();
      })
    );
  
};

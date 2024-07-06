import jwt from "jsonwebtoken";
export const makeToken = (data, jwtF = process.env.JWT_SECRECT, exp = "7d") => {
  const jwtToken = jwt.sign(data, jwtF, { expiresIn: exp });
  return jwtToken;
};

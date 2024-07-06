import bcryptjs from "bcryptjs";
export const makeHash = async (password) => {
  const salt = await bcryptjs.genSaltSync(10);
  const hashPass = bcryptjs.hash(password, salt);
  return hashPass;
};

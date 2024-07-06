import bcrypt from "bcryptjs"
const comparePasswords=async(oldpassword, password)=>{
    try {
      const passwordMatches = await bcrypt.compare(oldpassword, password);
      return passwordMatches;
    } catch (error) {
      throw error;
    }
  }

  export default comparePasswords
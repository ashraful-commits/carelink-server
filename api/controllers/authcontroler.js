import asyncHandler from "express-async-handler";
import User from "../model/UserModel.js"
import bcrypt from "bcryptjs";
import { makeToken } from "../helper/MakeToken.js";
import { sendAMail } from "../helper/Email.js";

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const {
    role,
    phone,
    address1,
    address2,
    city,
    state,
    county,
    zip,
    email,
    firstName,
    lastName,
    password,
    agreeTerms,
    agreePrivacyPolicy,
    caregiverID,
    patientID,
  } = req.body;

  try {
    // Validate if all required fields are provided
    if (!role || !phone || !address1 || !city || !state || !county || !zip || !email || !firstName || !lastName || !password || !agreeTerms || !agreePrivacyPolicy) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      role,
      phone,
      address1,
      address2: address2 || '', // Set default value if empty
      city,
      state,
      county,
      zip,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      agreeTerms,
      agreePrivacyPolicy,
      caregiverID: caregiverID || null,
      patientID: patientID || null, 
    });

    
      res.status(200).json({ message: "Registration Successful!",user:newUser });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc    Fetch all users
 * @route   GET /api/users
 * @access  Public
 */
export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc    Fetch user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ message: "User found", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc    Update user by ID
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const {
    role,
    phone,
    address1,
    address2,
    city,
    state,
    county,
    zip,
    email,
    firstName,
    lastName,
    password,
    agreeTerms,
    agreePrivacyPolicy,
    caregiverID,
    patientID,
  } = req.body;

  try {
    // Find user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.address1 = address1 || user.address1;
    user.address2 = address2 || user.address2 || '';
    user.city = city || user.city;
    user.state = state || user.state;
    user.county = county || user.county;
    user.zip = zip || user.zip;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.agreeTerms = agreeTerms || user.agreeTerms;
    user.agreePrivacyPolicy = agreePrivacyPolicy || user.agreePrivacyPolicy;
    user.caregiverID = caregiverID || user.caregiverID || null;
    user.patientID = patientID || user.patientID || null;

    // Save updated user
    user = await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (user) {
      res.status(200).json({ message: "User deleted successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found!" });
    }

    // Check if passwords match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Password is wrong!" });
    }

    const token = makeToken(
      {
        email: user.email,
        password: user.password,
      },
      process.env.JWT_SECRET,
      "7d"
    );
    const refToken = makeToken(
      {
        email: user.email,
        password: user.password,
      },
      process.env.REF_JWT_SECRET,
      "30d"
    );
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.APP_ENV !== 'development',
      sameSite: 'static',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: "Login Successful!", token, refToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
})

/**
 * @desc    Get logged in user data
 * @route   GET /api/users/me
 * @access  Private
 */

export const me = asyncHandler(async (req, res) => {
  if (!req.me) {
    return res.status(401).json({ message: "Login user data not found" });
  }
  return res.status(200).json({ user: req.me });
});


/**
 * @desc    Logout user
 * @route   GET /api/users/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res
    .clearCookie("accessToken")
    .status(200)
    .json({ message: "Logout successful" });
});

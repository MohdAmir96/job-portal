import jwt from "jsonwebtoken";
import { User } from "../models/user.modal.js";
import bcrypt from "bcryptjs";

// Registration (Sign Up) Controller
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, name } = req.body;

    // Check if required fields are present
    if (
      [fullName, email, phoneNumber, password, name].some((field) => !field)
    ) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      name,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Login Controller
export const logIn = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    // Check if the role matches
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account does not exist with the current role",
        success: false,
      });
    }

    // Generate JWT token
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Sanitize user data to avoid sending sensitive info
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    // Set the cookie with JWT token and send response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Ensure cookie is only sent via HTTP(S)
        sameSite: "strict", // Protect against CSRF
      })
      .json({
        message: "Logged in successfully",
        success: true,
        user: userData,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

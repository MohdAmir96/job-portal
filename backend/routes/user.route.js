import express from "express";
import isAuthenticated from "./../middlewares/isAuthenticated.js";
import {
  logIn,
  logout,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";

// Initialize the router
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", logIn);

// User update profile route
router.put("/profile/update", isAuthenticated, updateProfile);

// User logout
router.post("/logout", logout);

export default router;

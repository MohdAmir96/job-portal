import express from "express";
import { logIn, registerUser } from "../controllers/user.controller.js";

// Initialize the router
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", logIn);

export default router;

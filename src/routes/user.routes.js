import express from "express";
import {
  registerUser,
  verifyUser,
  resendVerifyToken,
  loginUser,
  logoutUser,
  getMe,
  forgotPasswordUser,
  resetPasswordUser,
} from "../controllers/user.controller.js";
import isLoggedIn from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:verificationToken", verifyUser);
router.post("/resend-verify-token", resendVerifyToken);
router.post("/login", loginUser);
router.get("/getMe", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/forgot-password", forgotPasswordUser);
router.post("/reset-password/:resetPasswordToken", resetPasswordUser);

export default router;

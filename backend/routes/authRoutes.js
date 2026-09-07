import express from "express";
import {register,login,verifyEmail,getUser,logout,updateUser,deleteUser} from "../controllers/authController.js";

const router = express.Router();
//post
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
//get
router.get("/user/:id", getUser);
//put
router.put("/user/:id", updateUser);
//delete
router.delete("/user/:id", deleteUser);

export default router;
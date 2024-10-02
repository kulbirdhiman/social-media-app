import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  suggestUser,
  updateProfile,
  followAndUnfollow,
} from "../controllers/userControlers.js";
import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/authraztion.js";
const router = express.Router();

router.route("/").post(upload.single("image"), register).get(auth, suggestUser);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile").get(auth, getProfile);
router.route("/updateprofile").put(auth, upload.single("image"), updateProfile);
router.route("/follow/:id").put(auth,followAndUnfollow)

export default router;

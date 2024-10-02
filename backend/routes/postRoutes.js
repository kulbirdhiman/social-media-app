import express from "express";
import { auth } from "../middlewares/authraztion.js";
import upload from "../middlewares/multer.js";
import {
  createPost,
  getallPost,
  toggleLike,
  comenetPost,
  deletePost
} from "../controllers/postController.js";
const router = express.Router();

router
  .route("/")
  .post(auth, upload.single("image"), createPost)
  .get(getallPost);
  router.route("/like/:id").put(auth,toggleLike);
  router.route("/comment/:id").put(auth, comenetPost);
  router.route("/delete/:id").delete(auth,deletePost)

export default router;

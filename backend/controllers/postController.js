import Post from "../models/post.model.js";
import expressAsyncHandler from "express-async-handler";
import uploadImage from "../utils/uploadImage.js";

const createPost = expressAsyncHandler(async (req, res) => {
  const { caption } = req.body;
  let localimage = req.file.path;
  let image = await uploadImage(localimage);
  try {
    const createdPost = await Post.create({
      caption,
      image,
      auther: req.user._id,
    });
    res.status(201).json({
      message: "post created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
const getallPost = expressAsyncHandler(async (req, res) => {
  try {
    const allpost = await Post.find().populate("auther", "-password");
    res.json(allpost);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});
const toggleLike = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findPost = await Post.findById(id);
    if (!findPost) {
      return res.status(404).json({
        error: "Post does not exist",
      });
    }

    const alreadyLiked = findPost.likes.includes(req.user._id);
    if (!alreadyLiked) {
      findPost.likes.push(req.user._id);
    } else {
      findPost.likes = findPost.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    }

    await findPost.save();
    res.json(findPost);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const comenetPost = expressAsyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  
  const comments = {
    user: req.user._id,
    content,
  };

  try {
    const commentedPost = await Post.findById(id);
    if (!commentedPost) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (!content) {
      return res.status(400).json({
        error: "No comment content provided",
      });
    }

    commentedPost.comment.push(comments);
    await commentedPost.save();
    res.json(commentedPost);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const deletePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const postcreated = await Post.findById(id)
  if(!postcreated.auther === req.user._id){
    res.status(404).json({
      message : "you are not owner of this post"
    })
  }
  try {
    const deleted = await Post.findByIdAndDelete(id);
    res.json({
      message: "post deleted successfuuly",
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});
export { createPost, getallPost, toggleLike, comenetPost,deletePost };

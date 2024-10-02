import expressasynchandler from "express-async-handler";
import User from "../models/user.mode.js";
import uploadImage from "../utils/uploadImage.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const register = expressasynchandler(async (req, res) => {
  const { username, email, password, bio, gender } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }
    const isExits = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (isExits) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    const imageFile = req.file.path;
    const profilePic = await uploadImage(imageFile);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
      gender,
      bio,
    });
    await createToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const login = expressasynchandler(async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    throw new Error("please fill all fields")
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: "User does not exist",
      });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(400).json({
        error: "Password is incorrect",
      });
    }
    await createToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      gender: user.gender,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
const logout = expressasynchandler(async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: Date.now(0) });
    res.clearCookie("jwt")
    res.json({
      message: "user logut successfully",
    });
  } catch (error) {
    res.send(error);
  }
});
const suggestUser = expressasynchandler(async (req, res) => {
  try {
    const users = await User.find({
      username: { $ne: req.user.username } // Use $ne to exclude the current user's username
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message // It's often better to send just the error message
    });
  }
});
const getProfile = expressasynchandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});
const updateProfile = expressasynchandler(async (req, res) => {
  const { bio, image } = req.body;
  
  // Check if the user exists
  const isUserExits = await User.findById(req.user._id);
  if (!isUserExits) {
    return res.status(404).json({
      error: "User does not exist",
    });
  }
  
  let profilePic = isUserExits.profilePic; 
  if (image && req.file) {
    try {
      const localImagePath = req.file.path;
      profilePic = await uploadImage(localImagePath);
    } catch (error) {
      return res.status(500).json({
        error: "Image upload failed",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      bio: bio || isUserExits.bio,
      profilePic: profilePic,
    },
    { new: true }
  );
  res.status(200).json(updatedUser);
});
const followAndUnfollow = expressasynchandler(async (req, res) => {
  const { id } = req.params;
  const isExits = await User.findById(id);
  if(req.user._id === id) {
    res.json({
      error : "you can't follow your self"
    })
  }
  if (!isExits) {
    return res.status(404).json({
      error: "User does not exist",
    });
  }
  const isAlreadyFollow = isExits.followers.includes(req.user._id);
  try {
    if (!isAlreadyFollow) {
      isExits.followers.push(req.user._id);
    } else {
      isExits.followers = isExits.followers.filter(
        (followerId) => followerId.toString() !== req.user._id.toString()
      );
    }
    await isExits.save();

    res.status(200).json(isExits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { register, login, logout, getProfile, suggestUser, updateProfile ,followAndUnfollow};

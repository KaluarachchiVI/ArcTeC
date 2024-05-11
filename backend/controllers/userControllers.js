const User = require("../models/userModel");
const express = require("express");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/genarateToken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const jwt = require('jsonwebtoken');

//@description     Login user
//@route           POST /api/user/login
//@access          Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id); // Generate token

    // Send the token and user ID in the response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      pic: user.pic,
      token: token, // Include the token in the response
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// controllers/userController.js

//@description     Update user role
//@route           PUT /api/user/:id/role
//@access          Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = req.body.role;
  await user.save();

  res.json({ message: "User role updated", user: user });
});







//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});




//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role in response
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Update user profile
//@route           PUT /api/user/:id
//@access          Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.pic = req.body.pic || user.pic;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    pic: updatedUser.pic,
    token: generateToken(updatedUser._id),
  });
});

//@description     Delete a user
//@route           DELETE /api/user/:id
//@access          Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.remove();

  res.json({ message: "User removed" });
});

//router.route("/register").post(registerUser);
//router.route("/login").post(loginUser);
//router.route("/").get(protect, allUsers);
//router.route("/:id").put(protect, updateUser).delete(protect, isAdmin, deleteUser);

const getArchitectName = asyncHandler(async (req, res) => {
  // Assuming architect's name is stored in displayName field of the user object
  const architectName = req.user.displayName;
  res.status(200).json({ architectName });
});

module.exports = {loginUser,registerUser,updateUser,deleteUser,getArchitectName,updateUserRole};

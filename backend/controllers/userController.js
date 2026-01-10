import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import { check, validationResult } from "express-validator";

const validateUser = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required!")
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Invalid Username, username must contain a minimum of 4 characters"
    ),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone Number is required!")
    .isLength({ min: 10, max: 10 })
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must contain 6 characters"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createUser = asyncHandler(async (req, res) => {
  const { username, phone, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: "EMAIL_RECORD_ALREADY_EXISTS" });
  }

  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    return res.status(400).json({ message: "PHONE_RECORD_ALREADY_EXISTS" });
  }

  // Check if this is the first user
  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Use provided profile picture or fallback to random
  const profilePic = req.body.profilePic || `https://picsum.photos/200?random=${Math.floor(
    Math.random() * 1000
  )}`;

  const newUser = new User({
    username,
    phone,
    email,
    password: hashedPassword,
    profilePic,
    isAdmin: isFirstUser, // First user becomes admin
  });

  try {
    await newUser.save();
    const token = createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      phone: newUser.phone,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      profilePic,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(400)
      .json({ message: "Invalid user data", error: error.message });
  }
});

const validateLogin = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is missing!")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401).json({ message: "AUTHENTICATION_FAILURE: INVALID_CREDENTIALS" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "AUTHENTICATION_FAILURE: INVALID_CREDENTIALS" });
    return;
  }

  const token = createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    phone: existingUser.phone,
    email: existingUser.email,
    profilePic: existingUser.profilePic,
    isAdmin: existingUser.isAdmin,
    token,
  });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: "SUBJECT_RECORDS_NOT_FOUND" });
    return;
  }

  res.json({
    _id: user._id,
    username: user.username,
    phone: user.phone,
    email: user.email,
    profilePic: user.profilePic,
  });
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { username, phone, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "SUBJECT_PROTOCOL_ERROR: USER_NOT_FOUND" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "AUTHORIZATION_REFUSED: INCORRECT_PASSWORD" });
  }

  if (username) user.username = username;

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists && phoneExists._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "CONFLIFT_DETECTED: PHONE_ALREADY_LINKED" });
    }
    user.phone = phone;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "CONFLICT_DETECTED: EMAIL_ALREADY_LINKED" });
    }
    user.email = email;
  }

  // Handle Profile Picture Update
  if (req.body.profilePic) {
    user.profilePic = req.body.profilePic;
  }

  try {
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "CRITICAL_ERROR: PROFILE_SYNCHRONIZATION_FAILED" });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.params;

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  let user;

  if (req.user.isAdmin) {
    user = await User.findById(id);
  } else {
    user = await User.findById(req.user._id);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  await user.save();

  res.json({ message: "Password updated successfully" });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "SUBJECT_PURGE_ERROR: RECORD_NOT_FOUND" });
    return;
  }

  if (user.isAdmin) {
    res.status(400).json({ message: "PROTOCOL_VIOLATION: CANNOT_PURGE_ADMIN" });
    return;
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: "User removed" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404).json({ message: "QUERY_FAILED: SUBJECT_NOT_FOUND" });
    return;
  }

  res.json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const { username, phone, email } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "OVERRIDE_FAILED: SUBJECT_NOT_FOUND" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
});

export {
  validateUser,
  handleValidationErrors,
  createUser,
  validateLogin,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  changePassword,
};

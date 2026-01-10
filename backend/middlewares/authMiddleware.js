import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  console.log("🔍 Received Cookies:", req.cookies); // Debugging

  let token = req.cookies?.jwt;

  // Fallback to Bearer token if cookie is not present
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found." });
    }

    next();
  } catch (error) {
    console.error("🔴 Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid." });
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized entry, admin only." });
  }
};

export { authenticate, authorizeAdmin };

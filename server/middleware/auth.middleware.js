import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { isTokenBlacklisted } from "../config/redis.config.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Check if token has been blacklisted via Redis (e.g. after logout)
      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) {
        return res.status(401).json({
          message: "Session expired or logged out. Please sign in again.",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "cashtrack_fallback_jwt_secret"
      );

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      req.token = token;
      req.tokenExp = decoded.exp;

      return next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      return res.status(401).json({ message: "Not Authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not Authorized, no token provided" });
  }
};

export default protect;

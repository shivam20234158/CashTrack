import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "cashtrack_fallback_jwt_secret",
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;

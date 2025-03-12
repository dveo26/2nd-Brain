import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token = req.header("Authorization");

    console.log("Received Token:", token);

    if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
      return;
    }

    // Extract token if using "Bearer <token>"
    const tokenParts = token.split(" ");
    if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
      token = tokenParts[1];
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT_SECRET is not defined in .env");
      res.status(500).json({ msg: "Server error: Missing JWT secret" });
      return;
    }

    // Verify JWT
    const verified = jwt.verify(token, secretKey) as any;
    if (!verified || !verified.id) {
      res.status(401).json({ msg: "Invalid token" });
      return;
    }

    // Attach user data to the request
    (req as any).user = { id: verified.id };

    console.log("Authenticated User:", (req as any).user);

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

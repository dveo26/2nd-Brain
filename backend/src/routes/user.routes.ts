import express, { Request, Response } from "express";
import User from "../model/user";
import { authenticator } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/user/:id",
  authenticator,
  async function (req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;

import express, { Request, Response } from "express";
import User from "../model/user";
import {authenticator} from "../middleware/authMiddleware"; 

const router = express.Router();

router.get("/user/:id", authenticator, async function (req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            else {
                const email = user.email;
                const username = user.username;
                const isVerified = user.isVerified;
                return res.status(200).json({ email, username, isVerified });
            }  
            
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

export default router;

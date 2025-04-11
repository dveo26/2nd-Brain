import { Request, Response } from "express";
import link from "../model/link";
import content from "../model/content";
import crypto from "crypto";
import mongoose from "mongoose";

export const createLink = async (req: Request, res: Response): Promise<any> => {
  try {
    // Get userId from the authenticated user instead of request body
    const userId = (req as any).user.id;
    const hash = crypto.randomBytes(6).toString("hex");

    
    const newLink = new link({
      hash,
      userId,
    });

    await newLink.save();
    console.log("Link saved successfully:", newLink);

    res.status(201).json({
      message: "Shareable link generated successfully",
      hash: hash,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLink = async (req: Request, res: Response): Promise<any> => {
  try {
    const { hash } = req.params;
    console.log("Received hash:", hash);

    const sharedLink = await link.findOne({ hash });
    console.log("Fetched link from DB:", sharedLink);

    if (!sharedLink) {
      console.log("Link not found in DB!");
      return res.status(404).json({ message: "Link not found" });
    }

    
    const getContent = await content.find({ userId: sharedLink.userId });
    console.log("Fetched content:", getContent);

    if (!getContent || getContent.length === 0) {
      return res
        .status(404)
        .json({ message: "No content found for this user" });
    }

    res.status(200).json(getContent);
  } catch (error) {
    console.error("Error fetching link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import {Request, Response} from "express";
import link from "../model/link";
import content from "../model/content";
import crypto from "crypto";
import mongoose from "mongoose";

export const createLink = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.body;
    const hash = crypto.randomBytes(6).toString("hex");

    console.log("Generating hash:", hash); 
    console.log("User ID:", userId); 

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

    // Use the correct model name
    const LinkModel = mongoose.model("Link");

    // Find the link in the database
    const Sharedlink = await LinkModel.findOne({ hash });
    console.log("Fetched link from DB:", Sharedlink);

    if (!Sharedlink) {
      console.log("Link not found in DB!");
      return res.status(404).json({ message: "Link not found" });
    }

    // Find content associated with the user ID in the link
    const Getcontent = await content.findOne({ userId: Sharedlink.userId });
    console.log("Fetched content:", Getcontent);

    if (!Getcontent) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json(Getcontent);
  } catch (error) {
    console.error("Error fetching link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
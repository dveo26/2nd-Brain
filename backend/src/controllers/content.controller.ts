import { Request, Response } from "express";
import mongoose from "mongoose";
import Content from "../model/content";
import Tag from "../model/tag";

/**
 * @desc Create new content
 */
export const createContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, type, link, image, tags } = req.body;
    const userId = (req as any).user.id;

    console.log("Request body:", req.body); // Log the request body
    console.log("User ID:", userId); // Log the user ID

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    // Ensure the type is valid
    const validTypes = ["video", "socialPost", "Notes", "document"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // Handle tag creation or retrieval
    const tagIds = await Promise.all(
      (tags || []).map(async (tag: { title: string; color: string }) => {
        let existingTag = await Tag.findOne({
          title: tag.title,
          userId: userId, // Add userId to the query to find user-specific tags
        });

        if (!existingTag) {
          existingTag = new Tag({
            title: tag.title,
            userId: userId, // Associate tag with the current user
          });
          await existingTag.save();
        }

        return existingTag._id;
      })
    );

    // Create new content
    const newContent = new Content({
      title,
      description,
      type,
      link: link || null,
      image: image || null, // Allow image for all types
      tags: tagIds,
      userId,
    });

    await newContent.save();
    console.log("Content saved:", newContent); // Log the saved content
    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Get all content for a user
 */
export const getUserContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const content = await Content.find({ userId }).populate("tags");
    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching user content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Get content by type for a user
 */
export const getContentByType = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { type } = req.params;

    const validTypes = ["video", "socialPost", "Notes", "document"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    const content = await Content.find({ userId, type }).populate("tags");
    res.status(200).json(content);
  } catch (error) {
    console.error("Error filtering content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Search content by title or tags
 */
export const searchContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Find tags that match the query and belong to the current user
    const userTags = await Tag.find({
      title: { $regex: query, $options: "i" },
      userId: userId,
    }).distinct("_id");

    const searchResults = await Content.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } }, // Search by title
        { tags: { $in: userTags } }, // Search by tags that belong to the user
      ],
    }).populate("tags");

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Update content
 */
export const updateContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, type, link, image, tags } = req.body;
    const { id } = req.params;
    const userId = (req as any).user.id;

    const existingContent = await Content.findOne({ _id: id, userId });

    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Validate content type
    const validTypes = ["video", "socialPost", "Notes", "document"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // Update tags if provided
    let tagIds = existingContent.tags;
    if (tags) {
      tagIds = await Promise.all(
        tags.map(async (tag: { title: string; color: string }) => {
          let existingTag = await Tag.findOne({
            title: tag.title,
            userId: userId, // Add userId to find user-specific tags
          });

          if (!existingTag) {
            existingTag = new Tag({
              title: tag.title,
              userId: userId, // Associate new tag with the current user
            });
            await existingTag.save();
          }

          return existingTag._id;
        })
      );
    }

    // Update content fields
    existingContent.title = title ?? existingContent.title;
    existingContent.description = description ?? existingContent.description;
    existingContent.type = type ?? existingContent.type;
    existingContent.link = link ?? existingContent.link;
    existingContent.image = image ?? existingContent.image;
    existingContent.tags = tagIds;

    await existingContent.save();
    res.status(200).json(existingContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Delete content
 */
export const deleteContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const contentData = await Content.findOneAndDelete({ _id: id, userId });

    if (!contentData) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

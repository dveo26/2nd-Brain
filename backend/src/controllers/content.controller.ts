import { Request, Response } from "express";
import mongoose from "mongoose";
import Content from "../model/content";
import Tag from "../model/tag";

export const createContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, type, link, tags } = req.body;
    const userId = (req as any).user.id;
    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    const tagIds = await Promise.all(
      tags.map(async (tag: { title: string; color: string }) => {
        let existingTag = await Tag.findOne({ title: tag.title });

        if (!existingTag) {
          // Create a new tag if it doesn't exist
          existingTag = new Tag({
            title: tag.title,
            color: tag.color || "#000000",
          });
          await existingTag.save();
        }

        return existingTag._id;
      })
    );

    const newContent = new Content({
      title,
      description,
      type,
      link: link || null,
      tags: tagIds,
      userId,
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

export const getContentByType = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const { type } = req.params;

    const content = await Content.find({ userId, type }).populate("tags");
    res.status(200).json(content);
  } catch (error) {
    console.error("Error filtering content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    const searchResults = await Content.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } }, // Search by title
        {
          tags: {
            $in: await Tag.find({
              title: { $regex: query, $options: "i" },
            }).distinct("_id"),
          },
        },
      ],
    }).populate("tags");

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, type, link, tags } = req.body;
    const { id } = req.params;
    const userId = (req as any).user.id;

    const existingContent = await Content.findOne({ _id: id, userId });

    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    const tagIds = await Promise.all(
      tags.map(async (tag: { title: string; color: string }) => {
        let existingTag = await Tag.findOne({ title: tag.title });

        if (!existingTag) {
          existingTag = new Tag({
            title: tag.title,
            color: tag.color || "#000000",
          });
          await existingTag.save();
        }

        return existingTag._id;
      })
    );

    existingContent.title = title || existingContent.title;
    existingContent.description = description || existingContent.description;
    existingContent.type = type || existingContent.type;
    existingContent.link = link || existingContent.link;
    existingContent.tags = tagIds || existingContent.tags;
    existingContent.updatedAt = new Date();

    await existingContent.save();
    res.status(200).json(existingContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

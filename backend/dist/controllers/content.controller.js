"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.searchContent = exports.getContentByType = exports.getUserContent = exports.createContent = void 0;
const content_1 = __importDefault(require("../model/content"));
const tag_1 = __importDefault(require("../model/tag"));
/**
 * @desc Create new content
 */
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, type, link, image, tags } = req.body;
        const userId = req.user.id;
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
        const tagIds = yield Promise.all((tags || []).map((tag) => __awaiter(void 0, void 0, void 0, function* () {
            let existingTag = yield tag_1.default.findOne({
                title: tag.title,
                userId: userId, // Add userId to the query to find user-specific tags
            });
            if (!existingTag) {
                existingTag = new tag_1.default({
                    title: tag.title,
                    userId: userId, // Associate tag with the current user
                });
                yield existingTag.save();
            }
            return existingTag._id;
        })));
        // Create new content
        const newContent = new content_1.default({
            title,
            description,
            type,
            link: link || null,
            image: image || null, // Allow image for all types
            tags: tagIds,
            userId,
        });
        yield newContent.save();
        console.log("Content saved:", newContent); // Log the saved content
        res.status(201).json(newContent);
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createContent = createContent;
/**
 * @desc Get all content for a user
 */
const getUserContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const content = yield content_1.default.find({ userId }).populate("tags");
        res.status(200).json(content);
    }
    catch (error) {
        console.error("Error fetching user content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserContent = getUserContent;
/**
 * @desc Get content by type for a user
 */
const getContentByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { type } = req.params;
        const validTypes = ["video", "socialPost", "Notes", "document"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid content type" });
        }
        const content = yield content_1.default.find({ userId, type }).populate("tags");
        res.status(200).json(content);
    }
    catch (error) {
        console.error("Error filtering content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getContentByType = getContentByType;
/**
 * @desc Search content by title or tags
 */
const searchContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        // Find tags that match the query and belong to the current user
        const userTags = yield tag_1.default.find({
            title: { $regex: query, $options: "i" },
            userId: userId,
        }).distinct("_id");
        const searchResults = yield content_1.default.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } }, // Search by title
                { tags: { $in: userTags } }, // Search by tags that belong to the user
            ],
        }).populate("tags");
        res.status(200).json(searchResults);
    }
    catch (error) {
        console.error("Error searching content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchContent = searchContent;
/**
 * @desc Update content
 */
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, type, link, image, tags } = req.body;
        const { id } = req.params;
        const userId = req.user.id;
        const existingContent = yield content_1.default.findOne({ _id: id, userId });
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
            tagIds = yield Promise.all(tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
                let existingTag = yield tag_1.default.findOne({
                    title: tag.title,
                    userId: userId, // Add userId to find user-specific tags
                });
                if (!existingTag) {
                    existingTag = new tag_1.default({
                        title: tag.title,
                        userId: userId, // Associate new tag with the current user
                    });
                    yield existingTag.save();
                }
                return existingTag._id;
            })));
        }
        // Update content fields
        existingContent.title = title !== null && title !== void 0 ? title : existingContent.title;
        existingContent.description = description !== null && description !== void 0 ? description : existingContent.description;
        existingContent.type = type !== null && type !== void 0 ? type : existingContent.type;
        existingContent.link = link !== null && link !== void 0 ? link : existingContent.link;
        existingContent.image = image !== null && image !== void 0 ? image : existingContent.image;
        existingContent.tags = tagIds;
        yield existingContent.save();
        res.status(200).json(existingContent);
    }
    catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateContent = updateContent;
/**
 * @desc Delete content
 */
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const contentData = yield content_1.default.findOneAndDelete({ _id: id, userId });
        if (!contentData) {
            return res.status(404).json({ message: "Content not found" });
        }
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteContent = deleteContent;

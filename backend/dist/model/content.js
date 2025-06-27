"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContentSchema = new mongoose_1.default.Schema({
    link: { type: String, default: "" },
    title: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ["video", "socialPost", "Notes", "document"], // Matches frontend
    },
    image: { type: String, default: "" }, // Only for social posts
    description: { type: String, default: "" },
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true } // Auto-manages createdAt & updatedAt
);
exports.default = mongoose_1.default.model("Content", ContentSchema);

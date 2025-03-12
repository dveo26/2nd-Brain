import mongoose from "mongoose";

export interface IContent extends mongoose.Document { 
    link?: string;
    title: string;
    type: "text" | "image" | "video" | "link";
    description: string;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ContentSchema: mongoose.Schema = new mongoose.Schema({
    link: { type: String, default: "" },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true , default: ""},
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IContent>("Content", ContentSchema);
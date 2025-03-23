import mongoose from "mongoose";

export interface IContent extends mongoose.Document {
  link?: string;
  title: string;
  type: "video" | "socialPost" | "Notes" | "document";
  image?: string;
  description?: string;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: mongoose.Schema = new mongoose.Schema(
  {
    link: { type: String, default: "" },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["video", "socialPost", "Notes", "document"], // Matches frontend
    },
    image: { type: String, default: "" }, // Only for social posts
    description: { type: String, default: "" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Auto-manages createdAt & updatedAt
);

export default mongoose.model<IContent>("Content", ContentSchema);

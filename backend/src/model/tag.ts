import mongoose from "mongoose";

export interface ITag extends mongoose.Document {
  title: string;
  color: string;
  userId: mongoose.Types.ObjectId;
}

const TagSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    color: { type: String, required: true, default: "#000000" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<ITag>("Tag", TagSchema);

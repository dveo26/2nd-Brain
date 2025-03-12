import mongoose from "mongoose";

export interface ILink extends mongoose.Document {
    hash: string;
    userId: mongoose.Types.ObjectId;
}

const LinkSchema: mongoose.Schema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true }); 

export default mongoose.model<ILink>("Link", LinkSchema);
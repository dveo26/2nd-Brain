import mongoose, { Document,Schema } from "mongoose";

export interface IUser extends Document { 
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }
},
    { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
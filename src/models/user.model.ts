import mongoose, { Schema, model } from "mongoose";

interface IUser {
    userName: string;
    email: string;
    password: string;
}

const users = model<IUser>("users", new Schema<IUser>({
    userName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
}))

export default users;
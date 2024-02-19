import mongoose from "mongoose";

const users = mongoose.model("users", new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
}))

export default users;
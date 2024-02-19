import mongoose from "mongoose";
import users from "./user.model";
mongoose.Promise = global.Promise;

const db = { mongoose, users };

db.mongoose = mongoose;
db.users = users;

export default db;
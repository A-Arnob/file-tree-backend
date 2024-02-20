import mongoose from "mongoose";
import users from "./user.model";
mongoose.Promise = global.Promise;

const db = { mongoose, users };

db.mongoose = mongoose;
db.users = users;


db.mongoose
    .connect("mongodb://localhost:27017/file-demoNew", {
    })
    .then(() => { console.log("MongoDB connected using mongoose"); })
    .catch((err: any) => { console.log(err); process.exit(); })


export default db;
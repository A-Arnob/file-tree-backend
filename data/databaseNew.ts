// const mongoose = require("mongoose");
import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017", {
  })
  .then(() => { console.log("MongoDB connected using mongoose"); })
  .catch((err: any) => { console.log(err); process.exit(); })

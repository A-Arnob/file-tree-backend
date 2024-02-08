const mongoose = require("mongoose");
// import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost/my_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

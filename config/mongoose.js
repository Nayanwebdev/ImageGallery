const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB);

const db = mongoose.connection;

db.on("error", () => {
  console.log("Connection error");
});

db.once("open", () => {
    console.log("db connected successfully");
});

mongoose.Model.exports = db;
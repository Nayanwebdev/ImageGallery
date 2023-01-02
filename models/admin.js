const mongoose = require("mongoose");

const multer = require('multer');

const path = require('path');

const AVTAR_PATH = path.join('/uploads/admins');

const adminSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', AVTAR_PATH));
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname));
  }
});

adminSchema.statics.uploadAvtar = multer({storage: storage}).single('avatar');

adminSchema.statics.avatarPath = AVTAR_PATH;

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;

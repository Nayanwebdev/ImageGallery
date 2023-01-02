const mongoose = require("mongoose");

const multer = require('multer');

const path = require('path');
const admin = require("./admin");

const GALLERY_PATH = path.join('/uploads/admins/gallery');

const gallerySchema = mongoose.Schema({  
  gallery: {
    type: String,
    required: true,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'admin'
  }
});

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', GALLERY_PATH));
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname));
  }
});

gallerySchema.statics.uploadAvtar = multer({storage: storage}).array('gallery');

gallerySchema.statics.galleryPath = GALLERY_PATH;

const gallery = mongoose.model("gallery", gallerySchema);
module.exports = gallery;

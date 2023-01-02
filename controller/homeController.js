const Admin = require("../models/admin");
const Gallery = require("../models/imgGallery");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
const fs = require("fs");

module.exports.register = (req, res) => {
  res.render("register");
};
module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login");
};
module.exports.homepage = async (req, res) => {
  try {
    const gallery = await Gallery.find({userId:req.user.id}).sort({_id: -1});    
    res.render("dashboard", { images: gallery });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.loginUser = async (req, res) => {
  return res.redirect("/dashboard");
};

module.exports.addUser = async (req, res) => {
  Admin.uploadAvtar(req, res, async (err) => {
    const Email = req.body.email;
    const extUser = await Admin.findOne({ email: Email });
    if (extUser) {
      console.log("user already registered");
      return res.redirect("/login");
    }
    if (err) {
      console.log("image not uploded");
      return false;
    }
    if (req.file) {
      var profileImage = Admin.avatarPath + "/" + req.file.filename;

      Admin.create(
        {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          city: req.body.city,
          designation: req.body.designation,
          about: req.body.about,
          avatar: profileImage,
        },
        (e) => {
          if (e) {
            console.log(e);
            return false;
          }
          return res.redirect("/login");
        }
      );
    }
  });
};

module.exports.logout = async (req, res) => {
  try {
    req.logout((err) => {
      res.redirect("/login");
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Admin.findByIdAndDelete(id);
    res.status(200).json("user deleted successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.delete = async (req, res) => {
  try {
    const record = await Admin.findById(req.params.id);
    console.log(record);
    const avatar = record.avatar;
    console.log(avatar);
    fs.unlinkSync(path.join(__dirname, "..", avatar));
    Admin.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        console.log("record not deleted");
        return false;
      }
      return res.redirect("/login");
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.update = async (req, res) => {
  try {
    Admin.findById(req.params.id, (err, admin) => {
      res.render("update", { admin: admin });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.updatePostUser = async (req, res) => {
  try {
    Admin.uploadAvtar(req, res, (err) => {
      if (err) {
        res.status(500).json({ message: "image upload failed" });
        return false;
      }
      if (req.file) {
        Admin.findById(req.body.user_id, (err, admin) => {
          if (err) {
            console.log("record not found");
            return false;
          }
          if (admin.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", admin.avatar));
          }
          if (req.file) {
            var newAvatar = Admin.avatarPath + "/" + req.file.filename;
            Admin.findByIdAndUpdate(
              req.body.user_id,
              {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                city: req.body.city,
                designation: req.body.designation,
                about: req.body.about,
                avatar: newAvatar,
              },
              (err, upAdmin) => {
                if (err) {
                  console.log("something went wrong");
                  return false;
                }
                return res.redirect("/dashboard");
              }
            );
          }
        });
      } else {
        Admin.findById(req.body.user_id, (err, data) => {
          if (err) {
            console.log(err.message);
            return res.redirect("back");
          }
          var avatar = data.avatar;
          Admin.findByIdAndUpdate(
            req.body.user_id,
            {
              userName: req.body.userName,
              email: req.body.email,
              password: req.body.password,
              city: req.body.city,
              designation: req.body.designation,
              about: req.body.about,
              avatar: avatar,
            },
            (err, upUser) => {
              if (err) {
                return false;
              }
              return res.redirect("/dashboard");
            }
          );
        });
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const extUser = await Admin.findOne({ _id: id });
    const updatedUser = req.body;
    const user = await Admin.findByIdAndUpdate(id, updatedUser);
    res.status(200).json("user updated successfully");
    res.redirect("/dashboard");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.singleUser = async (req, res) => {
  try {
    const user = req.params.userName;
    const findUser = await Admin.findOne({ userName: user });
    if (findUser == null) {
      res.send("no data available");
    } else {
      res.status(200).json({ user: findUser });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.uploadGallery = async (req, res) => {
  try {
    res.render("uploadGallery");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports.uploadImg = (req, res) => {
  Gallery.uploadAvtar(req, res, (err) => {
    if (err) {
      return false;
    }
    if (req.files) {
      const images = req.files;
      const results = images.map((image) => {
        let uploadImgs = new Gallery({
          gallery: Gallery.galleryPath + "/" + image.filename,
          userId:req.user.id
        });
        return uploadImgs
          .save()
          .then(() => {
            return true;
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      });
      Promise.all(results)
        .then(() => {
          return res.redirect("/dashboard");
        })
        .catch((err) => {
          console.log("error: " + err);
          return false;
        });
    }
  });
};

module.exports.deleteGalleryImg = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    // console.log(image);
    const gImg = image.gallery;
    fs.unlinkSync(path.join(__dirname, "..", gImg));
    Gallery.findByIdAndDelete(req.params.id,(err)=>{
      if(err) {
        console.log("error deleting image");
        return false;
      }
      return res.redirect("/dashboard")
    })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

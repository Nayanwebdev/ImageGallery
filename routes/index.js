const express = require("express");

const routes = express.Router();

const homeController = require("../controller/homeController");

const passport = require("../config/passport")

routes.get("/", homeController.register);

routes.get("/dashboard",passport.checkAuthentication, homeController.homepage);

routes.post("/addUser", homeController.addUser);

routes.get("/login", homeController.login);

routes.post("/loginUser",passport.authenticate('local',{failureRedirect:'/login',failureMessage:'invalid'}),homeController.loginUser);

routes.get("/logout", homeController.logout);

routes.delete("/deleteUser/:id", homeController.deleteUser);

routes.get("/delete/:id", homeController.delete);

routes.get("/update/:id",passport.checkAuthentication, homeController.update);

routes.post("/updatePostUser", homeController.updatePostUser);

routes.patch("/updateUser/:id", homeController.updateUser);

routes.get("/singleUser/:userName", homeController.singleUser);

routes.get("/uploadGallery" ,passport.checkAuthentication,homeController.uploadGallery);

routes.post("/uploadImg",passport.checkAuthentication,homeController.uploadImg);

routes.get("/deleteGalleryImg/:id",homeController.deleteGalleryImg)

module.exports = routes;

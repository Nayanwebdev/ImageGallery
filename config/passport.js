const passport = require("passport");
const localStategy = require("passport-local").Strategy;
const Admin = require("../models/admin");

passport.use(
  new localStategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await Admin.findOne({ email: email });
        if (!user) {
          console.log("user not found");
          return done(null, false);
        }
        if (user.password != password) {
          console.log("password mismatch");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        console.log(err.message);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Admin.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("something went wrong");
    return done(err);
  }
});

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
//   req.flash("error", "You are not authorized ! please login first");
  return res.redirect("/login");
};
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  return next();
};

module.exports = passport;

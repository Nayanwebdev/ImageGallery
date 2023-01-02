const express = require("express");
require("dotenv").config();
require('dotenv/config')
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");

const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
// const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require('./config/passport');
// const middlewareFlash = require("./config/middlewareFlash");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressLayouts);

app.use(express.static("public"));
app.use( '/uploads', express.static("uploads"));

app.use(cookieParser("nothing"));

// app.use(connectFlash());
// app.use(middlewareFlash.setFlash);
app.use(
  session({
    name: "nayan",
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

app.use("/", require("./routes/index"));
const db = require("./config/mongoose");

app.listen(port, (err) => {
  if (!err) {
    console.log("app listening on port " + port);
  }
});

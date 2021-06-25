const express = require("express");

const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//initiliazations
const app = express();
require(path.join(__dirname, "config/dbConfig.js"));
require("./config/passport");
//Settins
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);
app.set("trust proxy", 1);
//use

app.use(express.static(path.join(__dirname, "public")));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "mysecretappinexpress",
    resave: false,

    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//GLobal variables
app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//routes
app.use(require(path.join(__dirname, "routes/index.js")));
app.use(require(path.join(__dirname, "routes/notes.js")));
app.use(require(path.join(__dirname, "routes/users.js")));

//Port

app.listen(app.get("port"), () => {
  console.log(`Server is listening on ${app.get("port")} port`);
});

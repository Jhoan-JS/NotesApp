const router = require("express").Router();
const User = require("../models/userModel");
const passport = require("passport");
router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/users/signin",
  passport.authenticate("local", {
    failureRedirect: "/users/signin",
    failureFlash: true
  }),
  (req, res) => {
    res.redirect("/notes");
  }
);

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  const errors = [];
  console.log(email);

  const usedEmail = await User.find({ email });
  if (email.length > 0) {
    if (email == usedEmail) {
      errors.push({ text: "Email already used. Inserte another one" });
    }
  }
  if (name.length <= 0) {
    errors.push({ text: "Please Insert a name" });
  }

  if (password != confirm_password) {
    errors.push({ text: "The password does not match" });
  }

  if (password.length < 4) {
    errors.push({ text: "password must be at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors, name, email });
  } else {
    const newUser = new User({ name, email, password });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();

    res.redirect("/users/signin");
  }
});

router.get("/users/logout", (req, res) => {
  req.logout();

  res.redirect("/");
});

module.exports = router;

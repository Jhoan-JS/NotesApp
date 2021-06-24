const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.send("about");
});

module.exports = router;

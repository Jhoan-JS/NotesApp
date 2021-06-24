const router = require("express").Router();
const path = require("path");
const { isAuthenticated } = require("../helpers/auth");
const Notes = require(path.join(__dirname, "../models/notesModel.js"));

router.get("/notes", isAuthenticated, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id }).sort({ date: "desc" });

  res.render("note/notes", { notes });
});

//Add Notes
router.get("/notes/add-note", isAuthenticated, (req, res) => {
  res.render("note/add-note");
});

router.post("/notes/add-note", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  console.log(title);
  if (title.length == 0) {
    errors.push({ text: "Please write a title" });
  }
  if (description.length == 0) {
    errors.push({ text: "Please write a description" });
  }

  console.log(errors.length);

  if (errors.length > 0) {
    res.render("note/add-note", {
      errors,
      title,
      description
    });
  } else {
    const note = new Notes({
      title,
      description,
      user: req.user.id
    });

    await note.save();

    res.redirect("/notes");
  }
});

//Delete Note
router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  await Notes.findByIdAndRemove({ _id: id }, (err) => {
    if (err) return console.log(err);

    res.redirect("/notes");
  });
});

//Update note

router.get("/notes/update-note/:id", isAuthenticated, async (req, res) => {
  const { _id, title, description } = await Notes.findById({
    _id: req.params.id
  });

  res.render("note/edit-note", { id: _id, title, description });
});

router.put("/notes/update-note/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const errors = [];

  if (title.length == 0) {
    errors.push({ text: "Please write a title" });
  }
  if (description.length == 0) {
    errors.push({ text: "Please write a description" });
  }

  if (errors.length > 0) {
    res.render("note/edit-note", { errors, id, title, description });
  } else {
    await Notes.findByIdAndUpdate(
      id,
      { $set: { title, description } },
      (err) => {
        if (err) console.log(err);

        res.redirect("/notes");
      }
    );
  }
});

module.exports = router;

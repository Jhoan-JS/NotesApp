const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/NotesDB", {
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then((db) => {
    console.log("DB is connected ");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;

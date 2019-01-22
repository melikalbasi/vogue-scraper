var mongoose = require("mongoose");

// Reference to Schema constructor
var Schema = mongoose.Schema;

// Create NoteSchema object
var NoteSchema = new Schema({
  _articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
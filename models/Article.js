var mongoose = require("mongoose");

// Reference to Schema constructor
var Schema = mongoose.Schema;

// Create ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String, 
    required: true
  },
  img: {
    type: String, 
    required: true
  },
  author: {
    type: String, 
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  saved: {
    type: Boolean,
    default: false
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
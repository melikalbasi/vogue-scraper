var express = require("express"); 
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// GET route for scraping vogue website
app.get("/scrape", function(req, res) {
  axios.get("http://www.vogue.com/").then(function(response) {

    var $ = cheerio.load(response.data);

    $(".feed-card").each(function(i, element) {

      var result = {};

      result.title = $(this).find(".feed-card--title")
        .children("a")
        .text();
      result.link = $(this).find(".feed-card--title")
        .children("a")
        .attr("href");
      result.img = $(this).find(".collection-list--image").attr("srcset");
      result.author = $(this).find(".contributor-byline--name").text();

      console.log(result);

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.redirect("/");
    console.log("Scrape complete");
  });
});


// Route for homepage

app.get("/", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      // res.json(dbArticle);
      res.render("index", {article: dbArticle});
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saved articles

app.get("/saved", function(req, res) {
  db.Article.find({saved:true})
  .then(data => {
    res.render("saved", {article: data})
  })
  .catch( err => console.log(err))
  // res.render("saved");
});

// Route for saving articles to favorites
app.put("/saved/:id", function(req, res) {
  db.Article.findOneAndUpdate( {_id: req.params.id}, {$set: {saved: true}}, { new: true })
  .then(function(dbArticle) {
    res.json(dbArticle);
    console.log(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
    console.log(err);
  });
});

// Route for removing articles from favorites
app.post("/unsaved/:id", function(req, res) {
  db.Article.findOneAndUpdate( {_id: req.params.id}, {$set: {saved: false}})
  .then(function(dbSaved) {
    res.redirect("/saved")
    // res.json(dbArticle);
    console.log(dbSaved);
  })
});



app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log("NOTE: ", dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  // Log server-side when our server has started
  console.log("Server is listening on: http://localhost:" + PORT);
});
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

    $("h2.feed-card--title").each(function(i, element) {

      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.img = $(this).find("img").attr("src");
      result.author = $(this).find("contributor-byline--line").children("a").text();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");

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
  db.Note.find(
    {
      saved: true
    },
    function(error, found) {
      // log any errors
      if (error) {
        res.send(error);
        console.log(error);
      }
      else {
        // Otherwise, send the note to the browser
        // This will fire off the success function of the ajax request
        res.render("saved");
        console.log(found);
      }
    }
  );
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

// Route for saving/updating an Article's associatd note
app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  // Log server-side when our server has started
  console.log("Server is listening on: http://localhost:" + PORT);
});
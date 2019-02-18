# Vogue Scraper

All the current top headline articles from Vogue, available at your fingertips for your accessiblility and curation. Users can save their favorite articles as well as comment on them. You can refresh the pge to load all the most recent content from [Vogue.com](www.vogue.com). 

![Vogue](/public/images/voguescraper2.png)

## Getting Started

To use this app, you can either clone this repo down on your local device, or visit the deployed site [here](https://vogue-scraper.herokuapp.com/). 


### Installing

Install all dependencies by running 

```
npm i
```

in your terminal.

## MongoDB

In order for the app to render locally, you will need to have mongoDB installed on your computer. Depending on your operating system, the installation proccess will be different. You can find more info on installing mongoDB through their documentation.

```
https://docs.mongodb.com/manual/installation/
```

## Functionality

Use Vogue Scraper to save your favorite articles and leave comments.
![Vogue](/public/images/voguescraper1.png)


## Code snippets

Required Axios and Cheerio to scrape data from vogue.com

```
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

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    ```

## Deployment

Deployed on Heroku [here](https://vogue-scraper-1223.herokuapp.com/).

## Built With

* [Mongodb](https://www.mongodb.com/) - used to create noSQL database
* [Mongoose](https://mongoosejs.com/) - used to develop schema for models
* [Morgan](https://www.npmjs.com/package/morgan) - HTTP request middleware for node.js
* [Axios](https://www.npmjs.com/package/axios) - used to make HTTP requests 
* [jQuery](https://jquery.com/) - JavaScript library used
* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [Cheerio](https://github.com/cheeriojs/cheerio) - used to scrape data
* [Express](https://www.npmjs.com/package/express) - web framework used
* [Express Handlebars]() - dynamically generated HTML pages


## Authors

* **Melika Kalbasi** - *Initial work* - [melikalbasi](https://github.com/melikalbasi)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

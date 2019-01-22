// Event handler for save-article
$(document).on("click", "#save-button", function() {
  var thisId = $(this).attr("data-id");
  // Run a PUT request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId,
  })
    .then(function(data) {
      console.log(data);
    });
});



// When you click the savenote button
$(document).on("click", "#save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      _articleId: thisId,
      name: $("#nameinput").val(),
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#exampleFormControlTextarea1").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      // for (var i = 0; i < data.length; i++) {
      //   console.log(data);
      //   if (thisId === data._id) {
      //   }
        
      // }
      $(".allNotes").append("<div>Name: " + data.name + "<br>Title: " + data.title + "<br>Comment: " + data.body);
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#nameinput").val("");
  $("#titleinput").val("");
  $("#exampleFormControlTextarea1").val("");
});

// // When you click the savenote button
// $(document).on("click", "#save-note", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/" + thisId,
//     data: {
//       body: $("#comments").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#comments").val("");
// });




// Event handler for save-article
$(document).on("click", ".save-article", function() {
  var thisId = $(this).attr("data-id");
  // Run a PUT request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data: {
      title: title,
      link: link
    }
  })
    .then(function(data) {
      console.log(data);
    });
});
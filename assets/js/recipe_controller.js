$(document).ready(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  let recipe = await axios
    .get(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
      {
        crossDomain: true,
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": CONFIG.API_KEY
        }
      }
    )
    .then(res => {
      return res.data;
    });
  let summary = await axios
    .get(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/summary`,
      {
        crossDomain: true,
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": CONFIG.API_KEY
        }
      }
    )
    .then(res => {
      return res.data.summary;
    });

    let similar =  await axios
    .get(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/similar`,
      {
        crossDomain: true,
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": CONFIG.API_KEY
        }
      }
    )
    .then(res => {
      return res.data;
    });
    console.dir(recipe)
    console.dir(summary);
    console.dir(similar);



    $("#recipe-title").text(recipe.title);

    $("#recipe-description").html(`<p>${summary}</p`)
    $("#recipe-img").attr("src",`${recipe.image}`);
    

    var $ol = $('<ol>');

    for(let i = 0;i< recipe.analyzedInstructions[0].steps.length; i++){
        var $li = $('<li>').text(recipe.analyzedInstructions[0].steps[i].step);
        $ol.append($li);
    }
    $('#recipe-instructions').append($ol);
    
    for(let i = 0; i  < 3; i++){
      console.log(similar[i]);
      let card = await makeRecipeCard(similar[i]);
      console.log(card)
      $('#similar-recipes').append($(card));
    }




});







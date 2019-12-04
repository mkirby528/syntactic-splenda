$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  $("#search-info").text($("#search-info").text() + query);

  axios
    .get(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=2&query=${query}`,
      {
        crossDomain: true,
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": CONFIG.API_KEY
        }
      }
    )
    .then(async res => {
      for (let i = 0; i < res.data.results.length; i++) {
        let recipe = res.data.results[i];

        let card =await makeRecipeCard(recipe);

        $("#search-results").append(card);
      }
    });
});



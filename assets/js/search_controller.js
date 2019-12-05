$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  $("#search-info").text($("#search-info").text() + query);

  axios
    .get(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=9&query=${query}`,
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
let page = 1;
// $(window).scroll( function () {
//   if ($(document).height() - $(this).height() == $(this).scrollTop()) {
//     loadMore()
//   }
// }); 



let loadMore =async ()=>{
  let offset = 9*page++;
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  axios
  .get(
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=6&query=${query}&offset=${offset}`,
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
}

$("#load-more-button").on("click",loadMore)
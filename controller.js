$(document).ready(() => {
  axios
    .get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=10&query=pasta",
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
      for (let i = 0; i < 5; i++) {
        let recipe = res.data.results[i];
        axios
          .get(
            `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/information`,
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
            let card = await makeRecipeCard(res.data);

            $("#content-container").append(card);
          });
      }
    });
});

let makeRecipeCard = async recipe => {
  let result = await axios.get(
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe.id}/summary`,
    {
      crossDomain: true,
      headers: {
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "x-rapidapi-key": CONFIG.API_KEY
      }
    }
  );
  let summary = result.data.summary;
  return `
  <div class="card">
  <div class="card-image">
    <figure class="image">
      <img src="https://spoonacular.com/recipeImages/${recipe.id}-240x150.jpg" alt="Placeholder image">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content has-text-centered">
        <p class="title is-4">${recipe.title}</p>
        <hr class="is-marginless">
      </div>
   
    </div>
  
    <div class="content max-lines">
     ${summary}
    </div>
  </div>
  <div class="card-footer">
      <button class="button is-primary">Add To Favorites</button>
  </div>
 </div>
 `;
};

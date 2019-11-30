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
    .then(res => {
      for (let i = 0; i < res.data.results.length; i++) {
        let recipe = res.data.results[i];

        let card = makeRecipeCard(recipe);

        $("#search-results").append(card);
      }
    });
});

let makeRecipeCard = recipe => {
  return `
  <div id="${recipe.id}-card" class="card">
  <div class="card-image">
    <figure class="image">
      <img src="https://spoonacular.com/recipeImages/${recipe.id}-240x150.jpg" alt="Placeholder image">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content has-text-centered">
        <p id="card-title" class="title is-4">${recipe.title}</p>
        <hr class="is-marginless">
      </div>
    </div>

  </div>
  <div class="card-footer columns is-centered ">
      <a class="favorite-button button ">Add To Favorites</a>
      <a class="view-button button is-info ">View Recipe</a>
  </div>
 </div>
 `;
};

let handleFavoriteButton = e => {
  let card_id = $(e.target)
    .closest(".card")
    .attr("id");
  var id = card_id.split("-")[0];
  let tokenStr = document.cookie;
  axios
    .get("http://localhost:3000/account/status", {
      headers: { Authorization: `Bearer ${tokenStr}` }
    })
    .then(res => {
      console.log("logged");
      axios
        .post("http://localhost:3000/user/fav/", {
          data: id
        },          {headers: { Authorization: `Bearer ${tokenStr}` }},
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    })
    .catch(err => {
      if (err.response.status === 401) {
        // Not logged in
        window.location.href = "/login.html";
      }
    });
};

let handleViewButton = e => {
  let card_id = $(e.target)
    .closest(".card")
    .attr("id");
  var id = card_id.split("-")[0];
  window.location.href = `/recipe.html?id=${id}`;
};

$(document).on("click", ".favorite-button", handleFavoriteButton);
$(document).on("click", ".view-button", handleViewButton);

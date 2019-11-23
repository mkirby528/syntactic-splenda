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
  return `<div id="${recipe.id}-card" class="card">
  <div class="card-image">
    <figure class="image is-4by3">
    <img src="https://spoonacular.com/recipeImages/${recipe.id}-240x150.jpg" alt="Food Image">
    </figure>
  </div>
  <div class="card-content">
    <h1 class="card-title has-text-centered">${recipe.title}</h1>
    <hr>
    </div>
    <div class="card-footer">
    <a class="button favorite-button">Add to Favorite</a>
    <a class="button is-info">View Info</a>

  </div>
</div>`;
};

let handleFavoriteButton = e => {
  let card_id = $(e.target)
    .closest(".card")
    .attr("id");
  var id = card_id.split("-")[0];
  let tokenStr = document.cookie;
  console.log(tokenStr);
  axios
    .get("http://localhost:3000/account/status", {
      headers: { Authorization: `Bearer ${tokenStr}` }
    })
    .then(res => {
      axios
        .post("http://localhost:3000/user/favorites", {
          data: { id: id },
          headers: { Authorization: `Bearer ${tokenStr}` }

        })
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

$(document).on("click", ".favorite-button", handleFavoriteButton);

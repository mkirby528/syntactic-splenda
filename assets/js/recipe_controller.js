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
      let card = makeRecipeCard(similar[i]);
      console.log(card)
      $('#similar-recipes').append($(card));
    }




});


let makeRecipeCard =  recipe => {

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
  <div class="card-footer columns is-centered has-text-centered">
      <a class="favorite-button button ">Add To Favorites</a>
      <a class="view-button button is-info ">View Recipe</a>
</div>
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

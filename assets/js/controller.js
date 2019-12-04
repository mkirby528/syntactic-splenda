$(document).ready(() => {});

let handleFavoriteButton = async e => {
  let card_id = $(e.target)
    .closest(".card")
    .attr("id");
  var id = card_id.split("-")[0];
  let tokenStr = document.cookie;
  if (tokenStr) {
    let liked = $(e.target).hasClass("liked");
    if (liked) {
      $(e.target).removeClass("liked");
      $(e.target).text("Add to Favorites");
      axios.delete(`http://localhost:3000/user/fav/${id}`, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      });
    } else {
      $(e.target).addClass("liked");
      $(e.target).text("Remove From Favorites");

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
      axios
        .post(
          `http://localhost:3000/user/fav/${id}`,
          {
            data: {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              analyzedInstructions: recipe.analyzedInstructions,
              extendedIngredients: recipe.extendedIngredients
            }
          },
          { headers: { Authorization: `Bearer ${tokenStr}` } }
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  } else {
  }
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

let makeRecipeCard = async recipe => {
  let tokenStr = document.cookie;
  let likeStr = "";
  let card = await axios
    .get(`http://localhost:3000/user/fav/${recipe.id}`, {
      headers: { Authorization: `Bearer ${tokenStr}` }
    })
    .then(res => {
      likeStr = "liked";
      return $(`
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
           <a id="${recipe.id}-favButton" class="favorite-button ${likeStr} button ">Remove From Favorites</a>
           <a class="view-button button is-info ">View Recipe</a>
     </div>
       </div>
      </div>
      `);
    })
    .catch(()=>{
      likeStr = "";
      return $(`
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
           <a id="${recipe.id}-favButton" class="favorite-button ${likeStr} button ">Add to Favorites</a>
           <a class="view-button button is-info ">View Recipe</a>
     </div>
       </div>
      </div>
      `);
    }
    );

  return card;
};

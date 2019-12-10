$(document).ready(async() => {
  let tokenStr = document.cookie;
  // let username = await axios
  //     .get("http://localhost:3000/account/status", {
  //       headers: { Authorization: `Bearer ${tokenStr}` }
  //     })
  //     .then(res => {
  //       return(res.data.user.name);
  //     });
  // axios.post(`http://localhost:3000/custom/recipes/`,{data:{123:{id:123,title:"food", author:username}}} ,{
  //   headers: { Authorization: `Bearer ${tokenStr}` }
  // })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err));

  // axios.delete(`http://localhost:3000/custom/recipes/CR1nq2f`, {
  //   headers: { Authorization: `Bearer ${tokenStr}` }
  // })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err));
// axios.get("http://localhost:3000/custom/recipes/123").then(res=>console.log(res))

});
let handleFavoriteButton = async e => {
  let card_id = $(e.target)
    .closest(".recipe-card")
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
      $(e.target).text("Remove Favorite");
      let recipe;
      if(id.substring(0,2)==="CR"){
        recipe =  await axios.get(`http://localhost:3000/custom/recipes/${id}`).then(res=>{console.log(res); return res.data.result})

      }else{
      recipe = await axios
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
      }
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
    window.location.href = "/login.html";
  }
};

let handleViewButton = e => {
  let card_id = $(e.target)
    .closest(".recipe-card")
    .attr("id");
  var id = card_id.split("-")[0];
  window.location.href = `/recipe.html?id=${id}`;
};

$(document).on("click", ".favorite-button", handleFavoriteButton);
$(document).on("click", ".view-button", handleViewButton);

let makeRecipeCard = async recipe => {
  let tokenStr = document.cookie;
  let likeStr = "";
  console.log(typeof recipe.id)
  if (typeof recipe.id != 'string') {
  recipe.image =`https://spoonacular.com/recipeImages/${recipe.id}-240x150.jpg`
  }else{
    if(recipe.image ==""){
      recipe.image ="https://dummyimage.com/556x370/09094f/ffffff.png&text=Image+Not+Found+"
    }
  }
    if (tokenStr) {
    let card = await axios
      .get(`http://localhost:3000/user/fav/${recipe.id}`, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      })
      .then(res => {
        likeStr = "liked";
        return $(`
       <div id="${recipe.id}-card" class="recipe-card card">
       <div class="card-image">
         <figure class="image">
           <img src="${recipe.image}" alt="Placeholder image">
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
           <a id="${recipe.id}-favButton" class="favorite-button ${likeStr} button ">Remove Favorite</a>
           <a class="view-button button is-info ">View Recipe</a>
     </div>
       </div>
      </div>
      `);
      })
      .catch(() => {
        likeStr = "";
        return $(`
       <div id="${recipe.id}-card" class="recipe-card">
       <div class="card-image">
         <figure class="image">
           <img src="${recipe.image}" alt="Placeholder image">
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
           <a id="${recipe.id}-favButton" class="favorite-button ${likeStr} button ">Add  Favorites</a>
           <a class="view-button button is-info ">View Recipe</a>
     </div>
       </div>
      </div>
      `);
      });
    return card;
  } else {
    return $(`
      <div id="${recipe.id}-card" class="recipe-card">
      <div class="card-image">
        <figure class="image">
          <img src="${recipe.image}" alt="Placeholder image">
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
          <a id="${recipe.id}-favButton" class="favorite-button ${likeStr} button ">Add  Favorites</a>
          <a class="view-button button is-info ">View Recipe</a>
    </div>
      </div>
     </div>
     `);
  }
};

$(document).ready(async () => {
    let recipes =  await axios.get("http://localhost:3000/custom/recipes").then(res=>{return res.data.result})
    console.log(recipes);
    Object.keys(recipes).forEach( async function(key) {
        let card = await makeCustomCard(recipes[key]);
        $("#search-results").append(card);
    });
    
});



let makeCustomCard = async recipe => {
    if(recipe.image ==""){
        recipe.image = "https://dummyimage.com/556x370/09094f/ffffff.png&text=Image+Not+Found+"
    }
    let tokenStr = document.cookie;
    let likeStr = "";
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
               <br>
               <p class="subtitle">Created by ${recipe.author}</p>
               <hr class="is-marginless">
               <p class="description">${recipe.description}</p>
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
             <br>
             <p class="subtitle">Created by ${recipe.author}</p>
             <hr class="is-marginless">
             <p class="description">${recipe.description}</p>
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
            <br>
            <p class="subtitle">Created by ${recipe.author}</p>
            <hr class="is-marginless">
            <p class="description">${recipe.description}</p>
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
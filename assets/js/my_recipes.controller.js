$(document).ready( async() => {
    
        let tokenStr = document.cookie;
        if(tokenStr ==""){
            window.location.href="login.html?n=my_recipes.html"
        }
      let username = await axios
      .get("http://localhost:3000/account/status", {
         headers: { Authorization: `Bearer ${tokenStr}` }
       })
       .then(res => {
         return(res.data.user.name);
      });
      let recipes =  await axios.get("http://localhost:3000/custom/recipes").then(res=>{return res.data.result})
      Object.keys(recipes).forEach( async function(key) {
        if(recipes[key].author==username){
            let card = await makeCustomCard(recipes[key]);
            $("#search-results").append($(card));
        }

   
    });

});



let makeCustomCard = async recipe => {
    if(recipe.image ==""){
        recipe.image = "https://dummyimage.com/556x370/09094f/ffffff.png&text=Image+Not+Found+"
    }
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
        </div>
      </div>
  
    </div>
    <div class="card-footer columns is-centered has-text-centered">
        <a id="${recipe.id}-delButton" class="delete-button  button is-danger ">Delete Recipe</a>
        <a class="view-button button is-info ">View Recipe</a>
  </div>
    </div>
   </div>
   `);
  };

  $(document).on("click",".delete-button",async (e)=>{
    let id = $(e.target).attr("id").split("-")[0];
    let card =$(e.target).closest(".recipe-card") 
    let tokenStr = document.cookie;
    axios.delete(`http://localhost:3000/custom/recipes/${id}`, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      })
          card.remove();


})
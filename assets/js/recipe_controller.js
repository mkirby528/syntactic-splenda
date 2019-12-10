$(document).ready(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  let tokenStr = document.cookie;
  let likeStr
  if(!tokenStr){
    likeStr="";
  }
   likeStr =await axios
      .get(`http://localhost:3000/user/fav/${id}`, {
        headers: { Authorization: `Bearer ${tokenStr}` }
      }).then(()=> {return "liked"}).catch(()=> {return ""});
      $("#item-fav").addClass(`${likeStr}`)
  if($("#item-fav").hasClass("liked")){
    $("#item-fav").text("Remove Favorite")
     }
  $("#item-fav").attr('id', `${id}-favorite-button`);


  let recipe ,summary,similar;
  
  if(id.substr(0,2)=="CR"){
    recipe = await axios.get(`http://localhost:3000/custom/recipes/${id}`).then(res=>{return res.data.result});
    summary=recipe.description;
    similar = [];
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
  
  summary = await axios
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

    similar =  await axios
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


  }
    $("#recipe-title").text(recipe.title);

    $("#recipe-description").html(`<p>${summary}</p`)
    $("#recipe-img").attr("src",`${recipe.image}`);
    

    var $ol = $('<ol>');
    if(id.substr(0,2) !="CR"){
      for(let i = 0;i< recipe.analyzedInstructions[0].steps.length; i++){
        var $li = $('<li>').text(recipe.analyzedInstructions[0].steps[i].step);
        $ol.append($li);
    }
    $('#recipe-instructions').append($ol);
    
    for(let i = 0; i  < 3; i++){
      console.log(similar[i]);
      let card = await makeRecipeCard(similar[i]);
      console.log(card)
      $('#similar-recipes').append($(card));
    }}
    else{
      $("#recipe-instructions").append($(`<p>${recipe.instructions}</p>`))

      $("#similar-container").remove();
    }

  
});
$(".main-favorite-button").on("click",async(e)=>{
  let tokenStr = document.cookie;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if(!tokenStr){
    window.location.href = `/login.html?n=recipe.html?id=${id}`
  }

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
})







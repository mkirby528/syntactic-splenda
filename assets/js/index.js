$(document).ready(async () => {
  let result = await axios({
    method: "GET",
    url:
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "x-rapidapi-key": CONFIG.API_KEY
    },
    params: {
      number: "10"
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });

  let makeSlide = recipe => {
    console.log(recipe.image);
    if (typeof recipe.image === "undefined") {
      recipe.image =
        "https://dummyimage.com/556x370/09094f/ffffff.png&text=Image+Not+Found+";
    }
    return $(`
    
    
    
    
    
    <div class="mySlides fade">
    <div class="object-inner">
               <a class="button is-link slideshow-rec-button" href="recipe.html?id=${recipe.id}">View Recipe</a>
    <div class="object">
    <div style="background-color:#004e64;" class="subtitle has-text-centered has-text-white">Random Recipies </div>
    <img src="${recipe.image}" style="width:100%">
    <div class="text">${recipe.title}</div>

    </div>
 </div>

    


          </div>`);
  };

  for (let i = 0; i < result.recipes.length; i++) {
    $("#slideshow").append(makeSlide(result.recipes[i]));
  }

  // Next/previous controls
  let plusSlides = n => {
    showSlides((slideIndex += n));
  };

  let showSlides = n => {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";
  };

  let slideIndex = 1;
  showSlides(slideIndex);
  $(".prev").on("click", () => plusSlides(-1));
  $(".next").on("click", () => plusSlides(1));
});

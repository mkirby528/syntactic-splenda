$(document).ready(() => {
  renderNav();
  let tokenStr = document.cookie;
  if (tokenStr) {
    axios
      .get("http://localhost:3000/account/status", {
        headers: { Authorization: `Bearer ${tokenStr}` }
      })
      .then(res => {
        $("#user-name-text").text(res.data.user.data.full_name);
      });
  } else {
    $("#user-info-div").empty();
    $("#user-info-div ").append(
      $("<button/>", {
        class: "button is-small",
        id: "login-button",
        text: "Login",
        click: function() {
          window.location.href = "/login.html";
        }
      })
    );
  }
  $("#search-box").autocomplete({
    source: function(request, respond) {
      let term = request.term;
      axios({
        method: "GET",
        url:
          "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete",
        headers: {
          "content-type": "application/octet-stream",
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key": CONFIG.API_KEY
        },
        params: {
          number: "5",
          query: term
        }
      })
        .then(res => {
          let results = res.data.map(x => x.title);
          respond(results);
        })
        .catch(error => {});
    },
  
    minLength: 3,
    delay: 200
  });
});

$(document).on("click","#logout-button", () => {
  document.cookie = "";
  window.location.reload();
});

$(document).on("click", "#search-button",() => {
  window.location.href = `/search.html?q=${$("#search-box").val()}`;
});




let renderNav = () => {
  $("#navbar").append(`  <div class="navbar-brand">
  <a class="navbar-item has-text-weight-bold" href="/">
    <i class="fa fa-utensils has-text-white"></i>
    <pre id="title">S Y N T A C T I C  S P L E N D A</pre>
  </a>
</div>

<div class="search-field field has-addons">
  <div class="search-control control">
    <input
      id="search-box"
      class="input"
      type="text"
      placeholder="Search for a recipe"
    />
  </div>
  <div class="control">
    <a id="search-button" class="button is-info">
      Search
    </a>
  </div>
</div>
<a id="user-rec-button" class ="button navbar-item has-text has-text-weight-bold" style="text-decoration: underline;" href="userRecipies.html">User Created Recipes</a>

<div id="user-info-div" class="dropdown">
  <i class="fas fa-user"></i>
  <p id="user-name-text"></p>
  <div class="dropdown-content">
    <a href="/favorites.html">Favorites</a>
    <a id="logout-button">Logout</a>
  </div>
</div>`)
}
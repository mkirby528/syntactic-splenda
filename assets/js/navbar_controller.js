$(document).ready(() => {
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
});

$("#logout-button").on("click", () => {
  document.cookie = "";
  window.location.reload();
});

$("#search-button").on("click", () => {
  window.location.href = `/search.html?q=${$("#search-box").val()}`;
});

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

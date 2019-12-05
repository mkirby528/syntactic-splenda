$(document).ready(async () => {
  let tokenStr = document.cookie;
  if (!tokenStr) {
    window.location.href = "/login.html?n=/favorites.html";
  }
  let favorites = await axios.get(`http://localhost:3000/user/fav`, {
    headers: { Authorization: `Bearer ${tokenStr}` }
  });
  console.dir(favorites.data.result);
  for (let prop in favorites.data.result) {
    if (Object.prototype.hasOwnProperty.call(favorites.data.result, prop)) {
      let card = await makeRecipeCard(favorites.data.result[prop]);
      $("#favorites").append(card);
    }
  }
});


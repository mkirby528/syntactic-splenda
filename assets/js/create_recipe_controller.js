
$(document).ready( () => {
  let tokenStr = document.cookie;
  if(tokenStr==""){
    window.location.href = "/login.html?n=/create_recipe.html"
  }
});
let num_ings = 1;

$(document).on("click", ".add", function(e) {
  e.preventDefault();
  num_ings++;
  let fields = $(`<div id="ingrediant-fields-${num_ings}" class="field is-grouped ingrediant-field">
  <div class="control ">
    <input class="input" name="name${num_ings}" type="text" placeholder="Name" />
  </div>
  <div class="control">
    <input class="input" name="amt${num_ings}" type="text" placeholder="Amount"  />
  </div>
  <div class="select" >
    <select name="unit${num_ings}" >
      <option selected>Cups</option>
      <option>Tbsp</option>
      <option>Tsp</option>
      <option>Ounces</option>
    </select>
  </div>

</div>`);

  fields.appendTo(".ingredients");
  return false;
});

$(document).on("click", ".remove", function(e) {
  if ($(".ingrediant-field").length <= 1) {
    return false;
  }
  $(".ingrediant-field:last").remove();

  return false;
});

$("#form").on("submit", async e => {

  e.preventDefault();
  let values = {};
  console.log($("form").serializeArray());
  $.each($("form").serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  var getValue = function(valueName) {
    return values[valueName];
  };
  let ingredients = {};
  let instructions = getValue("instructions");
  instructions = instructions.replace(/\n\r?/g, "<br />");
  let recipe = {};
  for (let i = 1; i <= num_ings; i++) {
    let name = getValue("name" + i);
    let amt = getValue("amt" + i);
    let unit = getValue("unit" + i);
    if (name) {
      ingredients[name] = { name: name, amt: amt, unit: unit };
    }
  }
  recipe["ingredients"] = ingredients;
  recipe["instructions"] = instructions;
  recipe["title"] = getValue("title");
  recipe["image"] = getValue("image");
  recipe["description"] = getValue("description");
  let tokenStr = document.cookie;
  let username = await axios
    .get("http://localhost:3000/account/status", {
      headers: { Authorization: `Bearer ${tokenStr}` }
    })
    .then(res => {
      return res.data.user.name;
    });
recipe["author"]=username;
recipe['id']=makeid();
let id = recipe.id;
axios
    .post(
      `http://localhost:3000/custom/recipes/${id}`,
      {data:recipe},{
        headers: { Authorization: `Bearer ${tokenStr}` }
      }
    )
    .then(res => console.log(res))
    .catch(err => console.log(err));
  window.location.href= "my_recipes.html"
});


function makeid() {
    let r = Math.random().toString(36).substring(7);
    return "CR" + r;
 }
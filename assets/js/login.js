
$(document).ready(() => {
  $(document).on("submit", "form", function() {
    let name = ($('#name').val());
    let email = ($('#email').val());
    let password = ($('#password').val());
    console.log(name,email,password);
    axios.post("http://localhost:3000/account/create",
        {
            "name": name,
            "pass":  password,
            "data": {
              "email": email
            }
          }
    ).then(res=>{
      console.log(res);
      window.location.href="/";
    }
    )
    

    return false;
  });
});

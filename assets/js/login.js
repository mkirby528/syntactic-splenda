
$(document).ready(() => {
  
  $("#create-form").on("submit",function(e) {
    e.preventDefault();
    let name = ($('#name').val());
    let email = ($('#email').val());
    let username = ($('#username').val());
    let password = ($('#password').val());
    console.log(name,email,password);
    axios.post("http://localhost:3000/account/create",
        {
            "name": username,
            "pass":  password,
            "data": {
              "full_name": name,
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

  $("#login-form").on("submit",function(e) {
    e.preventDefault();
    let username = ($('#username').val());
    let password = ($('#password').val());
    console.log(username,password);
    axios.post("http://localhost:3000/account/login",
        {
            "name": username,
            "pass":  password,
          }
    ).then(res=>{
      console.log(res);
      document.cookie = res.data.jwt;

      window.location.href="/";
    }
    ).catch(err=>console.log(err));
    

    return false;
  });

});

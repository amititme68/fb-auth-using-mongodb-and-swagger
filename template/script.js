document.getElementById('loginbtn').addEventListener('click',loginWithFacebook,false)

function loginWithFacebook() {         
    FB.login(response=>{ 
      const {authResponse: {accessToken, userID}} = response;
      fetch('/login-with-facebook',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({accessToken, userID})
      }).then(res=>{
        console.log(res);
      })

      FB.api('/me',function(response){
          console.log(JSON.stringify(response));
          document.getElementById('status').innerHTML ='Thanks for logging in, ' + response.name + '!';
          document.getElementById('loginbtn').style.display = "none";
      })

    },{scope:'public_profile,email'});
    return true;
  }

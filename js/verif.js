
  const fetchAPI = (email) => {
    const url = "https://api-votaciones.herokuapp.com/candidatos";
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  
  const getEmail = () => {
    const email = { email: document.getElementById("email-input").value };
    console.log(email);
  
    // fetchAPI(email)
  };
  
  const verifCorreo = () => {

    document.getElementById("normal-message").style.display = "none";
    document.getElementById("error-message").style.display = "block";
    //Animar el mensaje
    document.getElementById("error-message").classList.add('animate__animated');
    document.getElementById("error-message").classList.add('animate__headShake');
    

  };

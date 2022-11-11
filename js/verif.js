import {nextForm} from "./two-step.JS";
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
  const email = {
    email: document.getElementById("email-input").value,
    pass: document.getElementById("password-input").value,
  };
  return JSON.stringify(email);
};

export const verifCorreo = () => {
  //hace peticion post con el email y contraseña

  // const Http = new XMLHttpRequest();
  // const url = "https://jsonplaceholder.typicode.com/posts";
  // Http.open("POST", url);
  // Http.send(getEmail());

  // Http.onreadystatechange = (e) => {
  //   console.log(Http.responseText);
  // };

  if(true){
    console.log("chupapi");
    // nextForm();
  }else if (error){
    
    document.getElementById("normal-message").style.display = "none";
    document.getElementById("error-message").style.display = "block";
    //Animar el mensaje
    document.getElementById("error-message").classList.add("animate__animated");
    document.getElementById("error-message").classList.add("animate__headShake");
  }

  // // hace la peticion post al login, si se encuentra devuelve el error:bool
  // if (true) {
  //   //guarda el token en Local Storage
  // }

};


//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

const getEmail = () => {

  const email = {
    correo: document.getElementById("email-input").value,
    pass: document.getElementById("password-input").value,
  };

  return email
};

let fetchUser = async ({correo,pass}) => {
  
  try {
    await axios.post('https://api-votaciones.vercel.app/login', {correo,pass} )
    .then(({data})=>{
      const {hadRegistered, tokenSession} = data;
      console.log(hadRegistered, tokenSession)
      if(!hadRegistered){
        next()
        localStorage.setItem('key', tokenSession );
        console.log("popo")
      }else{
        errorInter("Ya usted ha registrado su voto")
        
      }
    })
    // .catch(
    //   ({response})=>{
    //     // const error = response.data.message;
    //     // errorInter(error)
    //     console.log(response)
    //   }
    // )
    
  } catch (error) {
    console.log(error)
  }


};


const errorInter = (error) => {

  if (error == "Usuario no encontrado") {

    document.getElementById("normal-message").style.display = "none";
    document.getElementById("error-message-2").style.display = "none";
    document.getElementById("error-message").style.display = "block";
    document.getElementById("error-message-3").style.display = "none";

    document.getElementById("error-message").classList.add("animate__animated");

    document.getElementById("error-message").classList.add("animate__headShake");

  } else if (error == "Contraseña incorrecta") {
    document.getElementById("error-message-3").style.display = "none";
    document.getElementById("normal-message").style.display = "none";
    document.getElementById("error-message").style.display = "none";
    document.getElementById("error-message-2").style.display = "block";

    document
      .getElementById("error-message-2")
      .classList.add("animate__animated");
    document
      .getElementById("error-message-2")
      .classList.add("animate__headShake");

  }else if (error == "Ya usted ha registrado su voto"){
    document.getElementById("normal-message").style.display = "none";
    document.getElementById("error-message").style.display = "none";
    document.getElementById("error-message-2").style.display = "none";
    

    document
      .getElementById("error-message-3")
      .classList.add("animate__animated");
    document
      .getElementById("error-message-3")
      .classList.add("animate__headShake");
  }
};

$(".next").click(function () {
  //hace la llamada a la API para verificar si se encuentra en la base de datos
  //Pero primero la verificacion de que no sea un texto vacío

  fetchUser(getEmail());

  // document.getElementById("email-input").value;
  // document.getElementById("password-input").value;

  // if (
  //   document.getElementById("email-input").value == "" ||
  //   document.getElementById("password-input").value == ""
  // ) {
  //   //Activa el mensaje y lo anima
  //   setMessage();
  // } 
});

const next = () => {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this).parent().next();

  //activate next step on progressbar using the index of next_fs
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  //show the next fieldset
  next_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = now * 50 + "%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({
          transform: "scale(" + scale + ")",
          position: "absolute",
        });
        next_fs.css({ left: left, opacity: opacity });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack",
    }
  );
};
$(".previous").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();

  //de-activate current step on progressbar
  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");

  //show the previous fieldset
  previous_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale previous_fs from 80% to 100%
        scale = 0.8 + (1 - now) * 0.2;
        //2. take current_fs to the right(50%) - from 0%
        left = (1 - now) * 50 + "%";
        //3. increase opacity of previous_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({ left: left });
        previous_fs.css({
          transform: "scale(" + scale + ")",
          opacity: opacity,
        });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack",
    }
  );
});

$(".submit").click(function () {
  return false;
});

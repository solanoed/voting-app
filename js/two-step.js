// we inicialized this variable sin order to be able to acces to Our Moralis Project
const serverUrl = "https://server-woad-six.vercel.app/";
const appId = parseInt("001", 8);
//Moralis fucntion to connect with our Moralis App
Moralis.start({ serverUrl, appId });
let actualUser = "none";

//Function that allow us to connect to our web3 Provider , in the case of the project Metamask
async function handleAuth(provider) {
  const ethersProvider = await Moralis.enableWeb3({
    throwOnError: true,
    provider,
  });
  const signer = ethersProvider.getSigner();
  const account = await signer.getAddress();
  const chainId = Moralis.chainId;
  actualUser = account;

  document.getElementById("hash").setAttribute("placeholder", actualUser);
  document.getElementById("base").style.display = "none";
  document.getElementById("success").style.display = "block";

  console.log(actualUser);
  if (!account) {
    throw new Error(
      "Connecting to chain failed, as no connected account was found"
    );
  }
  if (!chainId) {
    throw new Error(
      "Connecting to chain failed, as no connected chain was found"
    );
  }

  const { message } = await Moralis.Cloud.run("requestMessage", {
    address: account,
    chain: parseInt(chainId, 16),
    network: "evm",
  });

  await authenticate({
    signingMessage: message,
    throwOnError: true,
  });
  

}

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var bool = false;
document.getElementById("normal-message").style.display = "block";
document.getElementById("error-message-2").style.display = "none";
document.getElementById("error-message-3").style.display = "none";
document.getElementById("error-message").style.display = "none";
var user_email = {};
const getEmail = () => {
  const email = {
    correo: document.getElementById("email-input").value,
    pass: document.getElementById("password-input").value,
  };

  return email;
};

let fetchUser = async ({ correo, pass }) => {
  try {
    const resp = await axios.post("https://api-votaciones.vercel.app/login", {
      correo,
      pass,
    });
    const { hadRegistered } = resp.data;
    // hadRegistered
    if (false) {
      errorInter("Ya usted ha registrado su voto");
    } else {
      resetMessages();
      console.log(resp.data);
      nextForm();
    }
    console.log(hadRegistered);
  } catch (error) {
    errorInter(JSON.parse(error.request.response).message);
  }
};

function nextForm() {
  if (animating) return false;
  animating = true;

  current_fs = $(".next").parent();

  next_fs = $(".next").parent().next();

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
}

$(".next").click(function () {
  user_email = getEmail();
  fetchUser(user_email);
});

$(".hash").click(function () {
  sendAndUpdate();
});

const createCartera = async () => {
  try {
    const resp = await axios.post(
      "https://api-votaciones.vercel.app/crearcartera",
      {
        hash: document.getElementById("hash").placeholder
      }
    );
      if (resp.data.mensaje=="La cartera ya existe") {
        errorInter("La cartera ya existe")
        }else{
          setTimeout(() => {
            window.location.replace("../index.html");
          }, "5000")
        }
      console.log(resp.data.mensaje)
  } catch (error) {
    console.log("create cartera: "+ error);
  }
};
const sendAndUpdate = async () => {
  try {
    handleAuth("metamask");
    await createCartera()
    await updateUser()
    
  } catch (error) {

    // console.log("send and update: "+ error)
    // errorInter("hash");
    document.getElementById("hash").setAttribute("placeholder", "Cartera no encontrada");
  }
};
const updateUser = async () => {
  try {
    const resp = await axios.patch(
      "https://api-votaciones.vercel.app/updateUser",
      {
        correo: getEmail().correo,
      }
    );
    console.log(resp.data);
  } catch (error) {
    console.log(error)
  }
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

const errorInter = (error = "No") => {
  document.getElementById("normal-message").style.display = "none";

  if (error == "Usuario no encontrado") {
    deact("none", "block", "none", "none");
    message("error-message");
  } else if (error == "Contraseña incorrecta") {
    deact("none", "none", "block", "none");
    message("error-message-2");
  } else if (error == "Ya usted ha registrado su voto") {
    deact("none", "none", "none", "block");
    message("error-message-3");
  } else if (error == "hash") {
    document.getElementById("base").style.display = "none";
    document.getElementById("not-success").style.display = "block";
    message("not-success");
  } else if(error == "La cartera ya existe"){
    document.getElementById("base").style.display = "none";
    document.getElementById("not-success-2").style.display = "block";
    message("not-success-2");
  }else {
    deact("none", "block", "none", "none");
    message("error-message");
  }
};
function deact(n, e1, e2, e3) {
  document.getElementById("normal-message").style.display = n;
  document.getElementById("error-message").style.display = e1;
  document.getElementById("error-message-2").style.display = e2;
  document.getElementById("error-message-3").style.display = e3;
}
function message(msg) {
  document.getElementById(msg).style.display = "block";
  document.getElementById(msg).classList.add("animate__animated");
  document.getElementById(msg).classList.add("animate__headShake");
}
function resetMessages() {
  document.getElementById("normal-message").style.display = "block";
  document.getElementById("error-message-2").style.display = "none";
  document.getElementById("error-message-3").style.display = "none";
  document.getElementById("error-message").style.display = "none";
}

document.getElementById("btn-iniciar").onclick = charge;

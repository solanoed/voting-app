// we inicialized this variable sin order to be able to acces to Our Moralis Project
const serverUrl = "https://server-woad-six.vercel.app/";
const appId = 001;

//Moralis fucntion to connect with our Moralis App
Moralis.start({ serverUrl, appId });

//Function that allow us to connect to our web3 Provider , in the case of the project Metamask
async function login() {
  //Assigned the Moralis user to a user variable
  let user = Moralis.User.current();

  if (!user) {
    try {
      //authenticate with a morali function
      user = await Moralis.authenticate({ signingMessage: "Authenticate " });

      //enable to connect to a web3 providr via moralis function
      await Moralis.enableWeb3();

      console.log(user);

      console.log(user.get("ethAddress"));
    } catch (error) {
      console.log(error);
    }
  }
}

// we create this function in order to be able to logout and login every time we charge the page so we can acces to every smartcontract function
async function logOut() {
  await Moralis.User.logOut();

  console.log("LogOut");
}

//object with the variables that will allow us to get the votes for Petro
const PetroVotes = {
  contractAddress: "0x32b86c4d397bf581ccdcb24d6696e6e128042efb",
  functionName: "petroVotes",
  abi: [
    {
      inputs: [],
      name: "petroVotes",
      outputs: [{ internalType: "uint256", name: "cant", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
};

//object with the variables that will allow us to get the votes for Rodolfo
const RodolfoVotes = {
  contractAddress: "0x32b86c4d397bf581ccdcb24d6696e6e128042efb",
  functionName: "rodolfoVotes",
  abi: [
    {
      inputs: [],
      name: "rodolfoVotes",
      outputs: [{ internalType: "uint256", name: "cant", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
};

//function that using a Moralis function giving of parameter the Objects we create beforehand call the function that allow us to get the Votes for each Candidate
async function getActualVotes() {
  //fucntions that get the value in the smart contract and we assign them to local variables
  const cantVotesPetro = await Moralis.executeFunction(PetroVotes);
  const cantVotesRodolfo = await Moralis.executeFunction(RodolfoVotes);

  //we create variables that get the wuery information that will show the votes for each candidate
  //let votesPetro = document.querySelector('.votes-number-trump');
  //let votesRodolfo = document.querySelector('.votes-number-biden');

  //we assign to the innerHTML of each wyery information their respective quantity of votes and at the same time we turn them into a decimal value insted of a hexadecimal
  //votesPetro.innerHTML = parseInt(cantVotesPetro._hex,16);
  //votesRodolfo.innerHTML = parseInt(cantVotesRodolfo._hex,16);
}

//Local functions that call the smart contract function ir oder to vote for each candidate following the same principal of the Previous Moralis functionExecute
async function votePetro() {
  try{
    let options = {
        contractAddress: "0x32b86c4d397bf581ccdcb24d6696e6e128042efb",
        functionName: "vote",
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "proposal", type: "uint256" },
            ],
            name: "vote",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          proposal: 0,
        },
      };

      await Moralis.executeFunction(options);
  }catch(error){
    switch(error.error.message){
      case 'execution reverted: user already vote':
        alert("Usted ya ha diligenciado su voto");
        break;
        case 'execution reverted: user is not allowed to vote':
          alert("Lo sentimos aun no ha comenzado el periodo de votacion o usted no esta autorizado para votar");
        break;
    }
  }
  
}
async function voteRodolfo() {
  try{
    let options = {
        contractAddress: "0x32b86c4d397bf581ccdcb24d6696e6e128042efb",
        functionName: "vote",
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "proposal", type: "uint256" },
            ],
            name: "vote",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        params: {
          proposal: 1,
        },
      };

      await Moralis.executeFunction(options);
  }catch(error){
    switch(error.error.message){
      case 'execution reverted: user already vote':
        alert("Usted ya ha diligenciado su voto");
        break;
        case 'execution reverted: user is not allowed to vote':
          alert("Lo sentimos aun no ha comenzado el periodo de votacion o usted no esta autorizado para votar");
        break;
    }
  }
  
}

//Local Function that allow the chairman to give right to vote to the array of wallets store on the database

//function called every time we charge the body of the HTML file so we can acces to every SmartContract function propoerly
async function charge() {
  await logOut();
  await login();
}

//set interval in order to refresh the votecount from the smartcontract everysecond
setInterval(getActualVotes, 1000);

const getCarteras = async () => {
  var hashes = [];
  const url = "https://api-votaciones.vercel.app/cartera";
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.map(({ hash }) => {
        hashes.push(hash);
      });
    })
    .catch((err) => console.log(err));

    
  return hashes;
};

var carteras = getCarteras();
async function rightToVote() {
  //we get the array and assign it to a local variable

  try{
    let options = {
    contractAddress: "0x32b86c4d397bf581ccdcb24d6696e6e128042efb",
    functionName: "whitelistUsers",
    abi: [
      {"inputs":[{"internalType":"address[]","name":"_users","type":"address[]"}],"name":"whitelistUsers","outputs":[],"stateMutability":"nonpayable","type":"function"},
    ],
    params: {
       _users: carteras,
    },
    };
    await Moralis.executeFunction(options);
  }catch(error){
    switch(error.error.message){
      case 'execution reverted':
        alert("Usted no esta autorizado para hacer uso de esta funcion");
        break;
    }
  }
    
 
  //here we will send the array to the blockchain
  
}

//Give the onclick function value to ech button
document.getElementById("btn-petro").onclick = votePetro;
document.getElementById("btn-rodolfo").onclick = voteRodolfo;
document.getElementById("btn-AllowToVote").onclick = rightToVote;

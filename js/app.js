
// we inicialized this variable sin order to be able to acces to Our Moralis Project
const serverUrl = "http://localhost:1337/server";
const appId = 001;

//Moralis fucntion to connect with our Moralis App
Moralis.start({serverUrl,appId});


//Function that allow us to connect to our web3 Provider , in the case of the project Metamask
async function login(){

    //Assigned the Moralis user to a user variable
    let user = Moralis.User.current();

    if(!user) {

        try {
            //authenticate with a morali function
            user = await Moralis.authenticate({ signingMessage : "Authenticate "});

            //enable to connect to a web3 providr via moralis function
            await Moralis.enableWeb3();

            console.log(user);

            console.log(user.get('ethAddress'));

        }catch (error) {

            console.log(error);

        }

    }

}

// we create this function in order to be able to logout and login every time we charge the page so we can acces to every smartcontract function 
async function logOut(){

    await Moralis.User.logOut();

    console.log('LogOut');

}

//object with the variables that will allow us to get the votes for Petro
const PetroVotes = {
  
};

//object with the variables that will allow us to get the votes for Rodolfo
const RodolfoVotes = {
     
};

//function that using a Moralis function giving of parameter the Objects we create beforehand call the function that allow us to get the Votes for each Candidate
async function getActualVotes(){

    //fucntions that get the value in the smart contract and we assign them to local variables
    

    //we create variables that get the wuery information that will show the votes for each candidate
    

    //we assign to the innerHTML of each wyery information their respective quantity of votes and at the same time we turn them into a decimal value insted of a hexadecimal
   
}


//Local functions that call the smart contract function ir oder to vote for each candidate following the same principal of the Previous Moralis functionExecute
async function votePetro(){


}
async function voteRodolfo(){


}


//Local Function that allow the chairman to give right to vote to the array of wallets store on the database
async function rightToVote(){


}


//function called every time we charge the body of the HTML file so we can acces to every SmartContract function propoerly
async function charge(){

    await logOut();
    await login();

}

//set interval in order to refresh the votecount from the smartcontract everysecond
setInterval(getActualVotes,1000);  



//Give the onclick function value to ech button
document.getElementById("btn-petro").onclick = votePetro;
document.getElementById("btn-rodolfo").onclick = voteRodolfo;
document.getElementById("btn-AllowToVote").onclick = rightToVote;
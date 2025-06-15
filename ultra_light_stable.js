let web3;
let contract;
let userAccount;

const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";  // Ultra Contract
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";    // G3X Token

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    document.getElementById("walletAddress").innerText = userAccount;
    contract = new web3.eth.Contract(stakingABI, contractAddress);
  } else {
    alert("Please install MetaMask to use this dApp!");
  }
});

document.getElementById("connectButton").addEventListener("click", async () => {
  const accounts = await web3.eth.requestAccounts();
  userAccount = accounts[0];
  document.getElementById("walletAddress").innerText = userAccount;
});

document.getElementById("stakeButton").addEventListener("click", async () => {
  const amount = document.getElementById("amountInput").value;
  const tier = document.getElementById("tierSelect").value;

  const token = new web3.eth.Contract([
    { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
  ], tokenAddress);

  const amountWei = web3.utils.toWei(amount, "ether");
  await token.methods.approve(contractAddress, amountWei).send({ from: userAccount });
  await contract.methods.stake(amountWei, tier).send({ from: userAccount });
  alert("Stake successful!");
});

document.getElementById("claimButton").addEventListener("click", async () => {
  const index = document.getElementById("stakeIndexInput").value;
  await contract.methods.claim(index).send({ from: userAccount });
  alert("Claim successful!");
});

document.getElementById("unstakeButton").addEventListener("click", async () => {
  const index = document.getElementById("stakeIndexInput").value;
  await contract.methods.unstake(index).send({ from: userAccount });
  alert("Unstake successful!");
});

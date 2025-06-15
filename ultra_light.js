let web3;
let contract;
let accounts;
let tokenContract;
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";  // G3X Token

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    tokenContract = new web3.eth.Contract([
      { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
    ], tokenAddress);

    document.getElementById("wallet").innerText = `Connected: ${accounts[0]}`;
  } else {
    alert("Please install MetaMask.");
  }
});

document.getElementById("connectButton").onclick = async () => {
  await ethereum.request({ method: "eth_requestAccounts" });
  accounts = await web3.eth.getAccounts();
  document.getElementById("wallet").innerText = `Connected: ${accounts[0]}`;
};

document.getElementById("stakeButton").onclick = async () => {
  const amount = document.getElementById("amountInput").value;
  const tier = document.getElementById("tierSelect").value;
  const amountWei = web3.utils.toWei(amount, "ether");

  const allowance = await tokenContract.methods.allowance(accounts[0], contractAddress).call();
  if (BigInt(allowance) < BigInt(amountWei)) {
    await tokenContract.methods.approve(contractAddress, web3.utils.toWei("1000000000", "ether")).send({ from: accounts[0] });
  }
  await contract.methods.stake(amountWei, tier).send({ from: accounts[0] });
  alert("Stake successful!");
};

document.getElementById("claimButton").onclick = async () => {
  const index = document.getElementById("indexInput").value;
  await contract.methods.claim(index).send({ from: accounts[0] });
  alert("Claim successful!");
};

document.getElementById("unstakeButton").onclick = async () => {
  const index = document.getElementById("indexInput").value;
  await contract.methods.unstake(index).send({ from: accounts[0] });
  alert("Unstake successful!");
};

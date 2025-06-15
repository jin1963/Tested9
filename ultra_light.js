let web3, accounts, contract, token;
const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.onload = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    document.getElementById("walletAddress").innerText = accounts[0];
    contract = new web3.eth.Contract(stakingABI, contractAddress);
    token = new web3.eth.Contract(erc20ABI, tokenAddress);
  } else {
    alert("Install MetaMask.");
  }
};

document.getElementById("stake").onclick = async () => {
  const amount = document.getElementById("amount").value;
  const duration = document.getElementById("duration").value;
  if (amount <= 0) return alert("Invalid amount");
  const amountWei = web3.utils.toWei(amount, "ether");

  const allowance = await token.methods.allowance(accounts[0], contractAddress).call();
  if (BigInt(allowance) < BigInt(amountWei)) {
    await token.methods.approve(contractAddress, web3.utils.toWei("1000000000", "ether")).send({ from: accounts[0] });
  }

  await contract.methods.stake(amountWei, duration).send({ from: accounts[0] });
  alert("✅ Stake success");
};

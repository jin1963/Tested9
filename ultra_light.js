let web3;
let contract;
let tokenContract;
let accounts;

const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";
const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        tokenContract = new web3.eth.Contract([
            {
                "constant": false,
                "inputs": [
                    { "name": "spender", "type": "address" },
                    { "name": "amount", "type": "uint256" }
                ],
                "name": "approve",
                "outputs": [{ "name": "", "type": "bool" }],
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    { "name": "owner", "type": "address" },
                    { "name": "spender", "type": "address" }
                ],
                "name": "allowance",
                "outputs": [{ "name": "", "type": "uint256" }],
                "type": "function"
            }
        ], tokenAddress);

        document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
    } else {
        alert("Please install MetaMask to use this dApp.");
    }
});

document.getElementById("connectWallet").onclick = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
};

// Approve
document.getElementById("approveButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    if (amount <= 0) return alert("Enter amount.");
    const amountWei = web3.utils.toWei(amount, "ether");
    try {
        await tokenContract.methods.approve(contractAddress, amountWei).send({ from: accounts[0] });
        alert("✅ Approved successfully.");
    } catch (err) {
        console.error(err);
        alert("❌ Approval failed.");
    }
};

// Stake
document.getElementById("stakeButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const tier = document.getElementById("tierSelect").value;
    if (amount <= 0) return alert("Enter amount.");
    const amountWei = web3.utils.toWei(amount, "ether");
    try {
        await contract.methods.stake(amountWei, tier).send({ from: accounts[0] });
        alert("✅ Stake successful.");
    } catch (err) {
        console.error(err);
        alert("❌ Stake failed.");
    }
};

// Claim
document.getElementById("claimButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    if (index === "") return alert("Enter stake index.");
    try {
        await contract.methods.claim(index).send({ from: accounts[0] });
        alert("✅ Claim successful.");
    } catch (err) {
        console.error(err);
        alert("❌ Claim failed.");
    }
};

// Unstake
document.getElementById("unstakeButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    if (index === "") return alert("Enter stake index.");
    try {
        await contract.methods.unstake(index).send({ from: accounts[0] });
        alert("✅ Unstake successful.");
    } catch (err) {
        console.error(err);
        alert("❌ Unstake failed.");
    }
};

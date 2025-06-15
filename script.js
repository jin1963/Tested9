let web3;
let contract;
let token;
let account;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        contract = new web3.eth.Contract(stakingABI, stakingAddress);
        token = new web3.eth.Contract([
            {
                "constant": false,
                "inputs": [
                    { "name": "_spender", "type": "address" },
                    { "name": "_value", "type": "uint256" }
                ],
                "name": "approve",
                "outputs": [{ "name": "", "type": "bool" }],
                "type": "function"
            }
        ], tokenAddress);
        document.getElementById("walletAddress").innerText = account;
    } else {
        alert("Please install MetaMask");
    }
}

document.getElementById("connectWallet").onclick = init;

document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const tier = document.getElementById("stakeTier").value;
    const amountWei = web3.utils.toWei(amount, "ether");

    // Auto-Approve Unlimited before stake
    await token.methods.approve(stakingAddress, web3.utils.toWei('1000000000', 'ether')).send({ from: account });

    await contract.methods.stake(amountWei, tier).send({ from: account });
    alert("✅ Stake successful!");
};

document.getElementById("claimBtn").onclick = async () => {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.claim(index).send({ from: account });
    alert("✅ Claim successful!");
};

document.getElementById("unstakeBtn").onclick = async () => {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.unstake(index).send({ from: account });
    alert("✅ Unstake successful!");
};

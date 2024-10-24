// scripts/withdraw.js

const hre = require('hardhat');
const abi = require('../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json');

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
    // Get contract deployed to sepolia
    const contractAddress = '0x60613589554090D20EEc7e7f1d02B6A99A8532BD';
    const contractABI = abi.abi;

    // Get the node connection and wallet
    const provider = new hre.ethers.providers.JsonRpcProvider("sepolia", process.env.API_KEY);

    /// Ensure signer is rhe same address as original contract deployer 
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Instantiate connected contract
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    // Check starting balances
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");

    // Withdraw funds if there are any
    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..");
        const withdrawnTxn = await buyMeACoffee.withdrawTips();
        await withdrawnTxn.wait();
    } else {
        console.log("no funds to withdraw");
    }

    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

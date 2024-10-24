const hre = require('hardhat');

async function main() {
    // get contract to deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    const deployedContract = await buyMeACoffee.waitForDeployment();
    const contractAddress = await deployedContract.getAddress();
    console.log("BuyMeACoffee deployed to: ", contractAddress);
}



main() 
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
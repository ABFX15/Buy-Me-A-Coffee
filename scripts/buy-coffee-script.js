const hre = require('hardhat');

// Returns the Ether balance of a given address
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.formatEther(balanceBigInt);
}

// Logs Ether balances for a list of addresses
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx++;
    }
}

// Logs the memos stored on-chain from coffee purchases 
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) left the following message: ${message}`);
    }
}

async function main() {
    try {
        // Get example accounts
        const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

        // get contract to deploy
        const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
        const buyMeACoffee = await BuyMeACoffee.deploy();
        
        // Wait for deployment and get address
        const deployedContract = await buyMeACoffee.waitForDeployment();
        const contractAddress = await deployedContract.getAddress();
        
        console.log("BuyMeACoffee deployed to: ", contractAddress);

        // Check balances before coffee purchase
        const addresses = [
            await owner.getAddress(),
            await tipper.getAddress(),
            contractAddress // Use the contract address we got after deployment
        ];
        
        console.log("== start ==");
        await printBalances(addresses);

        // Buy the owner a few coffees
        const tip = {value: hre.ethers.parseEther("1")};
        await buyMeACoffee.connect(tipper).buyCoffee("Adam", "Amazing!", tip);
        await buyMeACoffee.connect(tipper2).buyCoffee("Charlotte", "You're the best!!", tip);
        await buyMeACoffee.connect(tipper3).buyCoffee("Rhys", "Best coffee ever!!", tip);
        
        // check balances after coffee purchase
        console.log("== bought coffee ==");
        await printBalances(addresses);

        // Withdraw funds
        await buyMeACoffee.connect(owner).withdrawTips();
        console.log("== withdrawTips ==");
        await printBalances(addresses);

        // Read memos
        console.log("== memos ==");
        const memos = await buyMeACoffee.getMemos();
        printMemos(memos);

    } catch (error) {
        console.error("Error in main:", error);
        throw error;
    }
}


main() 
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
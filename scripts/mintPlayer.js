const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    const playerNFT = await ethers.getContractAt("PlayerNFT", "0xYourContractAddress");

    const tx = await playerNFT.mintPlayer(owner.address, "ipfs://your-player-metadata-hash");
    await tx.wait();

    console.log("Player minted successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

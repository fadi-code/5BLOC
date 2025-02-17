const { ethers } = require("hardhat");

async function main() {
    const playerId = 1; // ID du joueur à transférer
    const newTeamAddress = "0xNewTeamWalletAddress";

    const playerNFT = await ethers.getContractAt("PlayerNFT", "0xYourContractAddress");

    const tx = await playerNFT.transferPlayer(playerId, newTeamAddress);
    await tx.wait();

    console.log("Player transferred successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

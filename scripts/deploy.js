const { ethers } = require("hardhat");

async function main() {
    const FootballTeam = await ethers.getContractFactory("FootballTeam");
    const footballTeam = await FootballTeam.deploy();
    await footballTeam.deployed();
    console.log("FootballTeam deployed to:", footballTeam.address);

    const PlayerNFT = await ethers.getContractFactory("PlayerNFT");
    const playerNFT = await PlayerNFT.deploy();
    await playerNFT.deployed();
    console.log("PlayerNFT deployed to:", playerNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

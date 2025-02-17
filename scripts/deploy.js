const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    try {
        // Déployer FootballTeam
        const FootballTeam = await hre.ethers.getContractFactory("FootballTeam");
        const footballTeam = await FootballTeam.deploy();
        await footballTeam.deployed();
        console.log("✅ FootballTeam contract deployed to:", footballTeam.address);

        // Déployer PlayerNFT
        const PlayerNFT = await hre.ethers.getContractFactory("PlayerNFT");
        const playerNFT = await PlayerNFT.deploy();
        await playerNFT.deployed();
        console.log("✅ PlayerNFT contract deployed to:", playerNFT.address);

    } catch (error) {
        console.error("🚨 Erreur lors du déploiement:", error);
        process.exit(1);
    }
}

// Exécution du script
main().then(() => process.exit(0));

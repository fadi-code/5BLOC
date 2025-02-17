const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    try {
        // Déployer FootballTeam
        const FootballTeam = await hre.ethers.getContractFactory("FootballTeam");
        const footballTeam = await FootballTeam.deploy();
        await footballTeam.waitForDeployment(); // 🔹 Utiliser waitForDeployment()
        console.log("✅ FootballTeam contract deployed to:", await footballTeam.getAddress());

        // Déployer PlayerNFT
        const PlayerNFT = await hre.ethers.getContractFactory("PlayerNFT");
        const playerNFT = await PlayerNFT.deploy();
        await playerNFT.waitForDeployment();
        console.log("✅ PlayerNFT contract deployed to:", await playerNFT.getAddress());

    } catch (error) {
        console.error("🚨 Erreur lors du déploiement:", error);
        process.exit(1);
    }
}

// Exécuter le script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Une erreur s'est produite:", error);
        process.exit(1);
    });

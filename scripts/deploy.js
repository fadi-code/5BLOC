const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Déploiement avec le compte:", deployer.address);

    // Déploiement du contrat FootballTeam
    console.log("📢 Déploiement de FootballTeam en cours...");
    const FootballTeam = await hre.ethers.getContractFactory("FootballTeam");
    const footballTeam = await FootballTeam.deploy();
    await footballTeam.waitForDeployment(); // ✅ Correction ici
    console.log("✅ FootballTeam déployé à l'adresse:", await footballTeam.getAddress());

    // Déploiement du contrat PlayerNFT avec l'adresse de FootballTeam
    console.log("📢 Déploiement de PlayerNFT en cours...");
    const PlayerNFT = await hre.ethers.getContractFactory("PlayerNFT");
    const playerNFT = await PlayerNFT.deploy(await footballTeam.getAddress()); // ✅ Correction ici
    await playerNFT.waitForDeployment(); // ✅ Correction ici
    console.log("✅ PlayerNFT déployé à l'adresse:", await playerNFT.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Erreur de déploiement:", error);
        process.exit(1);
    });

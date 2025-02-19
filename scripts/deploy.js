const hre = require("hardhat");

async function main() {
    await hre.run("compile"); // Compilation des contrats avant déploiement

    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Déploiement avec le compte:", deployer.address);

    // Déploiement du contrat FootballTeam
    console.log("📢 Déploiement de FootballTeam en cours...");
    const FootballTeam = await hre.ethers.getContractFactory("FootballTeam");
    const footballTeam = await FootballTeam.deploy();
    await footballTeam.waitForDeployment(); // Attente de la confirmation du déploiement
    const footballTeamAddress = await footballTeam.getAddress();
    console.log("✅ FootballTeam déployé à l'adresse:", footballTeamAddress);

    // Déploiement du contrat PlayerNFT
    console.log("📢 Déploiement de PlayerNFT en cours...");
    const PlayerNFT = await hre.ethers.getContractFactory("PlayerNFT");
    const playerNFT = await PlayerNFT.deploy();
    await playerNFT.waitForDeployment();
    const playerNFTAddress = await playerNFT.getAddress();
    console.log("✅ PlayerNFT déployé à l'adresse:", playerNFTAddress);

    console.log("🎉 Tous les contrats ont été déployés avec succès !");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Erreur de déploiement:", error);
        process.exit(1);
    });

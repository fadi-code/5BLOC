const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Utilisation du compte:", deployer.address);

    const contractAddress = "ADRESSE_DU_CONTRAT_FOOTBALLTEAM"; // Remplace par l'adresse du contrat déployé
    const FootballTeam = await hre.ethers.getContractAt("FootballTeam", contractAddress);

    const teamAddresses = await FootballTeam.getAllTeams();
    console.log("📋 Liste des équipes créées :");

    for (const address of teamAddresses) {
        const team = await FootballTeam.getTeamDetails(address);
        console.log(`⚽ Équipe : ${team[0]}, 🏠 Propriétaire : ${team[1]}, 👥 Joueurs : ${team[2]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Erreur:", error);
        process.exit(1);
    });

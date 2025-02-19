require("dotenv").config(); // Charger les variables d'environnement

const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.FOOTBALL_TEAM_CONTRACT_ADDRESS; // Récupérer l'adresse du contrat FootballTeam
    
    // Vérifier si l'adresse est définie
    if (!contractAddress) {
        console.error("🚨 Erreur: L'adresse du contrat n'est pas définie dans les variables d'environnement.");
        process.exit(1);
    }

    const FootballTeam = await hre.ethers.getContractAt("FootballTeam", contractAddress);
    const teamAddresses = await FootballTeam.getAllTeamAddresses();
    console.log("📋 Liste des équipes créées :");

    for (const address of teamAddresses) {
        const [name, owner, playerCount] = await FootballTeam.getTeamDetails(address);
        console.log(`⚽ Équipe : ${name}, 🏠 Propriétaire : ${owner}, 👥 Joueurs : ${playerCount}`);
    }
}

main().catch((error) => {
    console.error("🚨 Erreur:", error);
    process.exit(1);
});

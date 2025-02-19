require("dotenv").config();
const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners(); // Récupérer tous les comptes disponibles

    // Récupérer l'index du compte dans le fichier .env
    const accountIndex = process.env.ACCOUNT_INDEX ? parseInt(process.env.ACCOUNT_INDEX) : 0;
    
    if (accountIndex >= accounts.length) {
        console.error("🚨 Index de compte invalide !");
        return;
    }

    const deployer = accounts[accountIndex]; // Utiliser un autre compte
    console.log("🚀 Utilisation du compte:", deployer.address);

    const contractAddress = process.env.FOOTBALL_TEAM_CONTRACT_ADDRESS;
    const FootballTeam = await hre.ethers.getContractAt("FootballTeam", contractAddress);

    const teamName = process.env.TEAM_NAME || `Team_${deployer.address.substring(0, 6)}`; // Nom unique si non fourni

    // Vérifier si l'équipe existe déjà
    const existingTeamAddress = await FootballTeam.getTeamByName(teamName);
    
    if (existingTeamAddress !== "0x0000000000000000000000000000000000000000") {
        console.log(`✅ L'équipe ${teamName} existe déjà à l'adresse: ${existingTeamAddress}`);
        return; 
    }

    // Création de l'équipe
    console.log(`🏗 Création de l'équipe ${teamName}...`);
    const tx = await FootballTeam.connect(deployer).createTeam(teamName);
    await tx.wait();
    console.log(`✅ Équipe ${teamName} créée avec succès.`);
}

main().catch((error) => {
    console.error("🚨 Erreur:", error);
    process.exit(1);
});

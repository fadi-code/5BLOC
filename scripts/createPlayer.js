require("dotenv").config(); // Charger les variables d'environnement

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Déploiement avec le compte:", deployer.address);

    const playerContractAddress = process.env.PLAYER_CONTRACT_ADDRESS; // Récupérer l'adresse du contrat PlayerNFT
    const PlayerNFT = await hre.ethers.getContractAt("PlayerNFT", playerContractAddress);

    const teamName = process.env.TEAM_NAME; // Récupérer le nom de l'équipe
    const metadataURI = process.env.METADATA_URI; // Récupérer l'URI des métadonnées

    // Obtenir l'adresse de l'équipe à partir du nom
    const teamAddress = await PlayerNFT.footballTeamContract.getTeamByName(teamName);
    require(teamAddress !== hre.ethers.constants.AddressZero, "L'équipe n'existe pas");

    console.log(`Ajout d'un joueur à l'équipe ${teamName}...`);
    const tx = await PlayerNFT.mintPlayer(teamAddress, metadataURI);
    await tx.wait();
    console.log(`✅ Joueur ajouté avec succès à l'équipe ${teamName}.`);
}

main().catch((error) => {
    console.error("🚨 Erreur:", error);
    process.exit(1);
});

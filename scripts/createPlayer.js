const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Déploiement avec le compte:", deployer.address);

    const teamContractAddress = "ADRESSE_DU_CONTRAT_FOOTBALLTEAM";
    const playerContractAddress = "ADRESSE_DU_CONTRAT_PLAYERNFT";

    const FootballTeam = await hre.ethers.getContractAt("FootballTeam", teamContractAddress);
    const PlayerNFT = await hre.ethers.getContractAt("PlayerNFT", playerContractAddress);

    const teamName = "PSG"; // Nom de l'équipe
    const metadataURI = "ipfs://bafkreiauzpjzt4dirhwaho6wwvmibvcg4vu5hqf7lc2gom3xhhllq2kg7e"; // Métadonnées du joueur

    try {
        const teamAddress = await FootballTeam.getTeamByName(teamName);
        if (teamAddress === "0x0000000000000000000000000000000000000000") {
            console.log(`🚨 L'équipe ${teamName} n'existe pas.`);
            return;
        }

        console.log(`Ajout d'un joueur à l'équipe ${teamName}...`);
        const tx = await PlayerNFT.mintPlayer(teamAddress, metadataURI);
        await tx.wait();
        console.log(`✅ Joueur ajouté avec succès à l'équipe ${teamName}.`);
    } catch (error) {
        console.error("🚨 Erreur lors de l'ajout du joueur:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Erreur:", error);
        process.exit(1);
    });

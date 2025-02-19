const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Utilisation du compte:", deployer.address);

    const contractAddress = "ADRESSE_DU_CONTRAT_FOOTBALLTEAM"; // Remplace par l'adresse du contrat déployé
    const FootballTeam = await hre.ethers.getContractAt("FootballTeam", contractAddress);

    const teamName = "PSG"; // Change le nom de l'équipe si nécessaire

    try {
        const existingTeam = await FootballTeam.getTeamByName(teamName);
        if (existingTeam !== "0x0000000000000000000000000000000000000000") {
            console.log(`✅ L'équipe ${teamName} existe déjà.`);
            return;
        }

        console.log(`Création de l'équipe ${teamName}...`);
        const tx = await FootballTeam.createTeam(teamName);
        await tx.wait();
        console.log(`✅ Équipe ${teamName} créée avec succès.`);
    } catch (error) {
        console.error("🚨 Erreur lors de la création de l'équipe:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("🚨 Erreur:", error);
        process.exit(1);
    });

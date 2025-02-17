async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Déployer FootballTeam
    const FootballTeam = await ethers.getContractFactory("FootballTeam");
    const footballTeam = await FootballTeam.deploy();
    console.log("FootballTeam contract deployed to:", footballTeam.address);

    // Déployer PlayerNFT
    const PlayerNFT = await ethers.getContractFactory("PlayerNFT");
    const playerNFT = await PlayerNFT.deploy();
    console.log("PlayerNFT contract deployed to:", playerNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

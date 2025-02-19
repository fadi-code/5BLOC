const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); // ✅ Premier compte Hardhat

  console.log("Déploiement avec le compte :", deployer.address);
  
  const SimplePlayerCard = await ethers.getContractFactory("SimplePlayerCard");
  const playerCard = await SimplePlayerCard.deploy(); // ✅ Pas besoin de passer d'admin en paramètre

  await playerCard.waitForDeployment();
  console.log("Contrat déployé à :", await playerCard.getAddress());
  console.log(" Admin du contrat :", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
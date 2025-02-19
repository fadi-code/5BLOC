const playerNFT = await ethers.getContractAt("PlayerNFT", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"); 
const teamAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; 
const metadataURI = "https://ipfs.io/ipfs/bafkreidjp5v7x4gutzdazuxu2gk7sod6wq7ll4gxdpetxaaxbkho6ny2ne"; // URI IPFS du fichier JSON

await playerNFT.mintPlayer(teamAddress, metadataURI);


------------------------------------------
const playerId = 1; 
const owner = await playerNFT.ownerOf(playerId);
console.log(owner); 
----------------------------
charger contrat team

const footballTeamAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const footballTeam = await ethers.getContractAt("FootballTeam", footballTeamAddress);

---------------------------------

// Créer une équipe (remplace par ton propre nom)
const teamName = "FC Barcelone";
await footballTeam.createTeam(teamName);



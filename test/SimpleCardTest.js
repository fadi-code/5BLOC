const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimplePlayerCard", function () {
    let SimplePlayerCard, contract, owner, user1, user2;
  
    beforeEach(async function () {
        // Déploiement du contrat
        [owner, user1, user2] = await ethers.getSigners();
        SimplePlayerCard = await ethers.getContractFactory("SimplePlayerCard");
        contract = await SimplePlayerCard.deploy();
        await contract.waitForDeployment();
    });

    it("Vérifie que l'admin est bien défini", async function () {
        expect(await contract.getAdmin()).to.equal(owner.address);
    });

    it("Vérifie l'ajout d'une carte", async function () {
        await contract.addCard("Ronaldo", "attaquant", ethers.parseUnits("1.9", 18), "ipfs://hash");
        
        const totalCards = await contract.cardCount();
        expect(totalCards).to.equal(1);

        const card = await contract.cards(0);
        expect(card.name).to.equal("Ronaldo");
        expect(card.cardType).to.equal("attaquant");
        expect(card.value).to.equal(ethers.parseUnits("1.9", 18));
    });

    it("Vérifie que seul l'admin peut ajouter une carte", async function () {
        await expect(
            contract.connect(user1).addCard("Messi", "milieu", ethers.parseUnits("5", 18), "ipfs://hash")
        ).to.be.revertedWith("Seul l'administrateur peut ajouter des cartes");
    });

    it("Vérifie que l'achat d'une carte fonctionne", async function () {
        await contract.addCard("Ronaldo", "attaquant", ethers.parseUnits("9", 18), "ipfs://hash");

        await contract.connect(user1).buyCard(0, { value: ethers.parseUnits("9", 18) });

        expect(await contract.ownerOf(0)).to.equal(user1.address);

        const newPrice = await contract.cards(0);
        expect(newPrice.value).to.equal(ethers.parseUnits("14", 18)); // 
    });

    it("Vérifie qu'un utilisateur ne peut pas acheter sa propre carte", async function () {
        await contract.addCard("Mbappé", "attaquant", ethers.parseUnits("1.9", 18), "ipfs://hash");

        await expect(
            contract.buyCard(0, { value: ethers.parseUnits("1.9", 18) })
        ).to.be.revertedWith("Vous ne pouvez pas acheter votre propre carte !");
    });

    it("Vérifie qu'un utilisateur ne peut pas acheter une carte sans assez d'ETH", async function () {
        await contract.addCard("Neymar", "milieu", ethers.parseUnits("5", 18), "ipfs://hash");

        await expect(
            contract.connect(user1).buyCard(0, { value: ethers.parseUnits("1.0", 18) })
        ).to.be.revertedWith("Fonds insuffisants !");
    });



    it("Vérifie que le verrouillage et déverrouillage de carte fonctionne", async function () {
        await contract.addCard("Modric", "milieu", ethers.parseUnits("1.5", 18), "ipfs://hash");

        await contract.toggleCardLock(0);
        let card = await contract.cards(0);
        expect(card.isLocked).to.equal(true);

        await contract.toggleCardLock(0);
        card = await contract.cards(0);
        expect(card.isLocked).to.equal(false);
    });

    it("Vérifie qu'un utilisateur ne peut pas verrouiller plus de 5 cartes", async function () {
        for (let i = 0; i < 6; i++) {
            await contract.addCard(`Joueur ${i}`, "defenseur", ethers.parseUnits("1.3", 18), "ipfs://hash");
        }

        for (let i = 0; i < 5; i++) {
            await contract.toggleCardLock(i);
        }

        await expect(
            contract.toggleCardLock(5)
        ).to.be.revertedWith("Vous ne pouvez verrouiller que 5 cartes au maximum !");
    });

    it("Vérifie que `getAvailableCards` retourne uniquement les cartes non verrouillées", async function () {
        await contract.addCard("Ronaldo", "attaquant", ethers.parseUnits("1.9", 18), "ipfs://hash");
        await contract.addCard("Messi", "milieu", ethers.parseUnits("1.5", 18), "ipfs://hash");
        await contract.toggleCardLock(0); // Verrouille la première carte

        const availableCards = await contract.getAvailableCards();
        expect(availableCards.length).to.equal(1); // Seulement Messi devrait être disponible
    });

    it("Vérifie que `getUserCards` retourne les cartes possédées par un utilisateur", async function () {
        await contract.addCard("Benzema", "attaquant", ethers.parseUnits("1.9", 18), "ipfs://hash");
        await contract.addCard("Pogba", "milieu", ethers.parseUnits("1.5", 18), "ipfs://hash");

        await contract.connect(user1).buyCard(0, { value: ethers.parseUnits("1.9", 18) });

        const user1Cards = await contract.getUserCards(user1.address);
        expect(user1Cards.length).to.equal(1);
    });
});
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlayerNFT", function () {
    let playerNFT, owner, team;

    beforeEach(async function () {
        [owner, team] = await ethers.getSigners();
        const PlayerNFT = await ethers.getContractFactory("PlayerNFT");
        playerNFT = await PlayerNFT.deploy();
        await playerNFT.deployed();
    });

    it("should mint a player", async function () {
        await playerNFT.mintPlayer(team.address, "ipfs://metadata-hash");
        expect(await playerNFT.ownerOf(0)).to.equal(team.address);
    });
});

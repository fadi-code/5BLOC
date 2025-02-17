const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FootballTeam", function () {
    let footballTeam, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const FootballTeam = await ethers.getContractFactory("FootballTeam");
        footballTeam = await FootballTeam.deploy();
        await footballTeam.deployed();
    });

    it("should create a team", async function () {
        await footballTeam.createTeam("FC Blockchain");
        expect((await footballTeam.teams(owner.address)).name).to.equal("FC Blockchain");
    });
});

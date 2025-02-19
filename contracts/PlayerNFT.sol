// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FootballTeam.sol";

contract PlayerNFT is ERC721URIStorage, Ownable {
    uint256 public nextPlayerId;
    mapping(uint256 => address) public playerToTeam;
    mapping(uint256 => uint256) public lastTransfer;
    uint256 public transferCooldown = 10 minutes;
    FootballTeam public footballTeamContract;

    event PlayerMinted(uint256 playerId, address team, string metadata);
    event PlayerTransferred(uint256 playerId, address from, address to);

    constructor(address _footballTeamContract) ERC721("FootballPlayerNFT", "FPNFT") Ownable() {
        footballTeamContract = FootballTeam(_footballTeamContract);
    }

    function mintPlayer(address team, string memory metadataURI) external onlyOwner {
        require(team != address(0), "Invalid team address");
        
        // Vérification si l'équipe existe
        (, address owner, ) = footballTeamContract.getTeamDetails(team);
        require(owner != address(0), "Team does not exist");

        uint256 playerId = nextPlayerId;
        _mint(team, playerId);
        _setTokenURI(playerId, metadataURI);
        playerToTeam[playerId] = team;
        nextPlayerId++;

        footballTeamContract.addPlayerToTeam(team, playerId);
        emit PlayerMinted(playerId, team, metadataURI);
    }

    function transferPlayer(uint256 playerId, address newTeam) external {
        require(ownerOf(playerId) == msg.sender, "You are not the owner");
        require(block.timestamp >= lastTransfer[playerId] + transferCooldown, "Cooldown active");

        // Vérification si l'équipe existe
        (, address owner, ) = footballTeamContract.getTeamDetails(newTeam);
        require(owner != address(0), "New team does not exist");

        _transfer(msg.sender, newTeam, playerId);
        playerToTeam[playerId] = newTeam;
        lastTransfer[playerId] = block.timestamp;
        emit PlayerTransferred(playerId, msg.sender, newTeam);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FootballTeam is Ownable {
    struct Team {
        string name;
        address owner;
        uint256 playerCount;
    }

    mapping(address => Team) public teams;
    address[] public teamAddresses; // Tableau pour stocker les adresses des équipes
    uint256 public maxPlayersPerTeam = 25;
    mapping(string => bool) public teamNames;  // Mappage pour vérifier si le nom d'équipe est déjà pris

    event TeamCreated(address indexed owner, string name);
    event PlayerAdded(address indexed team, uint256 playerId);

    constructor() Ownable() {}

    function createTeam(string memory name) external {
        require(teams[msg.sender].owner == address(0), "Team already exists");
        require(!teamNames[name], "Team name already taken"); // Vérifie si le nom existe déjà
        teams[msg.sender] = Team(name, msg.sender, 0);
        teamAddresses.push(msg.sender);  // Ajouter l'adresse de l'équipe au tableau
        teamNames[name] = true; // Marquer le nom comme utilisé
        emit TeamCreated(msg.sender, name);
    }

    function addPlayerToTeam(address team, uint256 playerId) external onlyOwner {
        require(teams[team].playerCount < maxPlayersPerTeam, "Team is full");
        teams[team].playerCount++;
        emit PlayerAdded(team, playerId);
    }

    // Fonction pour récupérer toutes les adresses des équipes
    function getAllTeamAddresses() external view returns (address[] memory) {
        return teamAddresses;
    }
}

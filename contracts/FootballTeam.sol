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
    mapping(string => address) public teamByName;  // Permet de récupérer une équipe par son nom
    address[] public teamAddresses;
    uint256 public maxPlayersPerTeam = 25;
    
    event TeamCreated(address indexed owner, string name);
    event PlayerAdded(address indexed team, uint256 playerId);

    constructor() Ownable() {}

    function createTeam(string memory name) external {
        require(teams[msg.sender].owner == address(0), "Team already exists");
        require(teamByName[name] == address(0), "Team name already taken");

        teams[msg.sender] = Team(name, msg.sender, 0);
        teamByName[name] = msg.sender; // Associer le nom à l'adresse de l'équipe
        teamAddresses.push(msg.sender);

        emit TeamCreated(msg.sender, name);
    }

    function addPlayerToTeam(address team, uint256 playerId) external {
        require(teams[team].owner != address(0), "Team does not exist");
        require(teams[team].playerCount < maxPlayersPerTeam, "Team is full");
        
        teams[team].playerCount++;
        emit PlayerAdded(team, playerId);
    }

    function getAllTeamAddresses() external view returns (address[] memory) {
        return teamAddresses;
    }

    function getTeamByName(string memory name) external view returns (address) {
        return teamByName[name]; // Renvoie l'adresse de l'équipe correspondant au nom
    }

    function getTeamDetails(address team) public view returns (string memory, address, uint256) {
        require(teams[team].owner != address(0), "Team does not exist");
        Team memory t = teams[team];
        return (t.name, t.owner, t.playerCount);
    }

    function getTeamDetailsByName(string memory name) external view returns (string memory, address, uint256) {
        address teamAddress = teamByName[name];
        require(teamAddress != address(0), "Team does not exist");
        return getTeamDetails(teamAddress);
    }
}

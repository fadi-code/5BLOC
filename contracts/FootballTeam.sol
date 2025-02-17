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
    uint256 public maxPlayersPerTeam = 25;

    event TeamCreated(address indexed owner, string name);
    event PlayerAdded(address indexed team, uint256 playerId);

    function createTeam(string memory name) external {
        require(teams[msg.sender].owner == address(0), "Team already exists");
        teams[msg.sender] = Team(name, msg.sender, 0);
        emit TeamCreated(msg.sender, name);
    }

    function addPlayerToTeam(address team, uint256 playerId) external onlyOwner {
        require(teams[team].playerCount < maxPlayersPerTeam, "Team is full");
        teams[team].playerCount++;
        emit PlayerAdded(team, playerId);
    }
}

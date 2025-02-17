// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlayerNFT is ERC721URIStorage, Ownable {
    uint256 public nextPlayerId;
    mapping(uint256 => address) public playerToTeam;
    mapping(uint256 => uint256) public lastTransfer;
    uint256 public transferCooldown = 10 minutes;

    event PlayerMinted(uint256 playerId, address team, string metadata);
    event PlayerTransferred(uint256 playerId, address from, address to);

    constructor() ERC721("FootballPlayerNFT", "FPNFT") {}

    function mintPlayer(address team, string memory metadataURI) external onlyOwner {
        uint256 playerId = nextPlayerId;
        _mint(team, playerId);
        _setTokenURI(playerId, metadataURI);
        playerToTeam[playerId] = team;
        nextPlayerId++;
        emit PlayerMinted(playerId, team, metadataURI);
    }

    function transferPlayer(uint256 playerId, address newTeam) external {
        require(ownerOf(playerId) == msg.sender, "You are not the owner");
        require(block.timestamp >= lastTransfer[playerId] + transferCooldown, "Cooldown active");

        _transfer(msg.sender, newTeam, playerId);
        playerToTeam[playerId] = newTeam;
        lastTransfer[playerId] = block.timestamp;
        emit PlayerTransferred(playerId, msg.sender, newTeam);
    }
}

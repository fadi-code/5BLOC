// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimplePlayerCard is ERC721, Ownable {
    struct Card {
        string name;
        string cardType;
        string value;
        string hash;
        uint createdAt;
    }

    mapping(uint256 => Card) public cards;
    uint256 private _nextCardId;

    address private admin; // ✅ Adresse de l'admin

    constructor() ERC721("SimplePlayerCard", "SPC") {
        admin = msg.sender; // ✅ Définit automatiquement l'admin comme le premier compte Hardhat
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'administrateur peut ajouter des cartes");
        _;
    }

    function addCard(
        string memory _name,
        string memory _cardType,
        string memory _value,
        string memory _hash
    ) public onlyAdmin {
        uint256 cardId = _nextCardId;
        _nextCardId++;

        cards[cardId] = Card({
            name: _name,
            cardType: _cardType,
            value: _value,
            hash: _hash,
            createdAt: block.timestamp
        });

        _mint(msg.sender, cardId);
    }

    function getAdmin() public view returns (address) {
        return admin;
    }
}
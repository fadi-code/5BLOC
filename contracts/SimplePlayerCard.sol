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
    uint256 public cardCount; // ✅ Nombre total de cartes créées

    address private admin; // ✅ Adresse de l'admin

    constructor() ERC721("SimplePlayerCard", "SPC") {
        admin = msg.sender; // ✅ Définit l'admin au premier déploiement
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
        cardCount++; // ✅ Incrémente le compteur de cartes
        uint256 cardId = cardCount;

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

    function getCard(uint256 cardId) public view returns (string memory, string memory, string memory, string memory, uint256) {
        require(cardId > 0 && cardId <= cardCount, "Carte non existante");
        Card memory card = cards[cardId];
        return (card.name, card.cardType, card.value, card.hash, card.createdAt);
    }
}
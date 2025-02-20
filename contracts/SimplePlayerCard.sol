// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimplePlayerCard is ERC721, Ownable {
    struct Card {
        string name;
        string cardType;
        uint256 value;
        string hash;
        uint256 createdAt;
        bool isLocked;
        uint256 lastPurchaseTime; // Stocke le dernier achat
    }

    mapping(uint256 => Card) public cards;
    mapping(address => uint256[]) public ownerCards;
    uint256 private _nextCardId;
    address private admin;
    uint256 public constant MAX_CARDS_PER_WALLET = 10;
    uint256 public constant MAX_LOCKED_CARDS = 5;
    uint256 public constant PURCHASE_COOLDOWN = 180; // Temps d'attente en secondes (3 minutes)

    event CardCreated(uint256 indexed cardId, string name, string cardType, uint256 value, string hash, address indexed owner);
    event CardPurchased(address indexed buyer, uint256 cardId, uint256 oldPrice, uint256 newPrice);
    event CardLocked(uint256 indexed cardId, bool isLocked);

    constructor() ERC721("SimplePlayerCard", "SPC") {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'administrateur peut ajouter des cartes");
        _;
    }

    modifier canBuyCard(address buyer) {
        require(ownerCards[buyer].length < MAX_CARDS_PER_WALLET, "Vous ne pouvez pas posseder plus de 10 cartes !");
        _;
    }

    function addCard(
        string memory _name,
        string memory _cardType,
        uint256 _value,
        string memory _hash
    ) public onlyAdmin {
        uint256 cardId = _nextCardId;
        _nextCardId++;

        cards[cardId] = Card({
            name: _name,
            cardType: _cardType,
            value: _value,
            hash: _hash,
            createdAt: block.timestamp,
            isLocked: false,
            lastPurchaseTime: 0
        });

        _mint(msg.sender, cardId);
        ownerCards[msg.sender].push(cardId);

        emit CardCreated(cardId, _name, _cardType, _value, _hash, msg.sender);
    }

    function buyCard(uint256 cardId) public payable canBuyCard(msg.sender) {
        address seller = ownerOf(cardId);
        require(seller != msg.sender, "Vous ne pouvez pas acheter votre propre carte !");
        require(!cards[cardId].isLocked, "Cette carte est bloquee par son proprietaire !");
        require(msg.value >= cards[cardId].value, "Fonds insuffisants !");
        
        // Verification du temps d'attente
        require(block.timestamp >= cards[cardId].lastPurchaseTime + PURCHASE_COOLDOWN, "Cette carte ne peut pas etre achetee pour le moment !");

        uint256 currentPrice = cards[cardId].value;
        uint256 priceIncrease = getPriceIncrease(cards[cardId].cardType);

        // Transfert du paiement au vendeur
        payable(seller).transfer(currentPrice);

        // Transfert de la carte a l'acheteur
        _transfer(seller, msg.sender, cardId);

        // Mise a jour du proprietaire
        ownerCards[msg.sender].push(cardId);

        // Augmentation de la valeur de la carte
        cards[cardId].value = currentPrice + priceIncrease;
        
        // Mise a jour du dernier achat
        cards[cardId].lastPurchaseTime = block.timestamp;

        emit CardPurchased(msg.sender, cardId, currentPrice, cards[cardId].value);
    }

    function getPriceIncrease(string memory cardType) public pure returns (uint256) {
        if (keccak256(abi.encodePacked(cardType)) == keccak256(abi.encodePacked("attaquant"))) {
            return 5;
        } else if (keccak256(abi.encodePacked(cardType)) == keccak256(abi.encodePacked("milieu"))) {
            return 4;
        } else if (keccak256(abi.encodePacked(cardType)) == keccak256(abi.encodePacked("defenseur"))) {
            return 3;
        } else if (keccak256(abi.encodePacked(cardType)) == keccak256(abi.encodePacked("gardien"))) {
            return 8;
        }
        return 0;
    }

    function getTimeUntilNextPurchase(uint256 cardId) public view returns (uint256) {
        if (block.timestamp >= cards[cardId].lastPurchaseTime + PURCHASE_COOLDOWN) {
            return 0; // Achat possible immediatement
        }
        return (cards[cardId].lastPurchaseTime + PURCHASE_COOLDOWN) - block.timestamp;
    }

    function toggleCardLock(uint256 cardId) public {
        require(ownerOf(cardId) == msg.sender, "Vous ne pouvez verrouiller que vos propres cartes !");
        
        uint256 lockedCount = 0;
        for (uint i = 0; i < ownerCards[msg.sender].length; i++) {
            if (cards[ownerCards[msg.sender][i]].isLocked) {
                lockedCount++;
            }
        }
        require(lockedCount < MAX_LOCKED_CARDS || cards[cardId].isLocked, "Vous ne pouvez verrouiller que 5 cartes au maximum !");

        cards[cardId].isLocked = !cards[cardId].isLocked;
        emit CardLocked(cardId, cards[cardId].isLocked);
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function getUserCards(address user) public view returns (uint256[] memory) {
        return ownerCards[user];
    }

    function getAvailableCards() public view returns (uint256[] memory) {
        uint256 count = 0;
        uint256[] memory tempArray = new uint256[](_nextCardId);

        for (uint256 i = 0; i < _nextCardId; i++) {
            if (!cards[i].isLocked) {
                tempArray[count] = i;
                count++;
            }
        }

        uint256[] memory availableCards = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            availableCards[j] = tempArray[j];
        }

        return availableCards;
    }

    function cardCount() public view returns (uint256) {
        return _nextCardId;
    }
}

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress } from "./config";
import PlayerCardABI from "./SimplePlayerCard.json";
import CreateCardModal from "./CreateCardModal";

const App = () => {
  const [account, setAccount] = useState(null);
  const [contractOwner, setContractOwner] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cards, setCards] = useState([]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Installez MetaMask !");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    setAccount(accounts[0]);

    // Récupérer l'adresse du propriétaire du contrat
    const abi = PlayerCardABI.abi;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
      const owner = await contract.getAdmin();
      setContractOwner(owner);
      setIsAdmin(owner.toLowerCase() === accounts[0].toLowerCase());
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération de l'admin :", error);
    }

    // Récupérer le solde de l'utilisateur
    const balance = await provider.getBalance(accounts[0]);
    setUserBalance(ethers.formatEther(balance));

    // Récupérer les cartes
    fetchCards();
  };

  const fetchCards = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, PlayerCardABI.abi, provider);

      const totalCards = await contract.cardCount();
      let cardsArray = [];

      for (let i = 1; i <= totalCards; i++) {
        try {
          const card = await contract.cards(i);
          cardsArray.push({
            id: i,
            name: card.name,
            type: card.cardType,
            value: card.value,
            image: card.hash, // URI IPFS
          });
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer la carte ID: ${i}`);
        }
      }

      setCards(cardsArray);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des cartes :", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <h2>DApp Cartes de Joueurs</h2>

      <button onClick={connectWallet}>
        {account ? `Connecté : ${account.slice(0, 6)}...` : "Connecter MetaMask"}
      </button>

      {account && (
        <>
          {isAdmin ? (
            <button onClick={() => setModalOpen(true)}>Ajouter une Carte</button>
          ) : (
            <h3>Votre Solde : {userBalance} ETH</h3>
          )}
        </>
      )}

      <CreateCardModal isOpen={modalOpen} closeModal={() => { setModalOpen(false); fetchCards(); }} />

      <h3>Cartes Disponibles</h3>
      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div key={index} className="card">
              <img src={card.image} alt={card.name} />
              <h4>{card.name}</h4>
              <p>Type: {card.type}</p>
              <p>Valeur: {card.value}</p>
            </div>
          ))
        ) : (
          <p>Aucune carte disponible.</p>
        )}
      </div>
    </div>
  );
};

export default App;
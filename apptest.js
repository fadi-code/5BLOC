"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PlayerCardABI from "./SimplePlayerCard.json";
import CreateCardModal from "./components/CreateCardModal";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [contractOwner, setContractOwner] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [allCards, setAllCards] = useState([]); // ✅ Stocke toutes les cartes pour l'admin
  const [modalOpen, setModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Installez MetaMask !");
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      setAccount(accounts[0]);

      // Récupération du solde
      const balance = await provider.getBalance(accounts[0]);
      setUserBalance(ethers.formatEther(balance));

      // Connexion au contrat
      const contract = new ethers.Contract(contractAddress, PlayerCardABI.abi, signer);
      const owner = await contract.getAdmin();
      setContractOwner(owner);
      setIsAdmin(owner.toLowerCase() === accounts[0].toLowerCase());

      fetchUserCards(contract, accounts[0]);
      if (owner.toLowerCase() === accounts[0].toLowerCase()) {
        fetchAllCards(contract);
      }
    } catch (error) {
      console.error("🚨 Erreur lors de la connexion à MetaMask :", error);
    }
  };

  // ✅ Fonction pour récupérer les cartes de l'utilisateur
  const fetchUserCards = async (contract, userAddress) => {
    try {
      const totalCards = await contract.cardCount();
      let userCardsArray = [];

      for (let i = 1; i <= totalCards; i++) {
        try {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            const card = await contract.cards(i);
            userCardsArray.push({
              id: i,
              name: card.name,
              type: card.cardType,
              value: card.value,
              image: card.hash,
              owner,
              isLocked: card.isLocked, // ✅ Ajout du statut verrouillé/non verrouillé
            });
          }
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer la carte ID: ${i}`);
        }
      }

      setUserCards(userCardsArray);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des NFT utilisateur :", error);
    }
  };

  // ✅ Fonction pour récupérer toutes les cartes pour l'Admin
  const fetchAllCards = async (contract) => {
    try {
      const totalCards = await contract.cardCount();
      let allCardsArray = [];

      for (let i = 1; i <= totalCards; i++) {
        try {
          const card = await contract.cards(i);
          const owner = await contract.ownerOf(i);
          allCardsArray.push({
            id: i,
            name: card.name,
            type: card.cardType,
            value: card.value,
            image: card.hash,
            owner,
            isLocked: card.isLocked,
          });
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer la carte ID: ${i}`);
        }
      }

      setAllCards(allCardsArray);
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération de toutes les cartes :", error);
    }
  };

  // ✅ Fonction pour bloquer/débloquer une carte
  const toggleLockCard = async (cardId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PlayerCardABI.abi, signer);

      const tx = await contract.toggleCardLock(cardId);
      await tx.wait();

      alert("✅ Statut de la carte mis à jour !");
      connectWallet(); // Recharge les cartes après modification
    } catch (error) {
      console.error("🚨 Erreur lors du verrouillage/déverrouillage de la carte :", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen text-white px-8 py-6 relative overflow-hidden">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-700 via-pink-500 to-red-500"></div>

      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold">Manage Your Best Players</h2>

        {account ? (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg text-white">
            <p><strong>Compte :</strong> {account.slice(0, 6)}...{account.slice(-4)}</p>
            <p><strong>Solde :</strong> {userBalance} ETH</p>
            <p>
              <strong>Statut :</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${isAdmin ? "bg-blue-600" : "bg-green-600"}`}>
                {isAdmin ? "Admin" : "Utilisateur"}
              </span>
            </p>
          </div>
        ) : (
          <button onClick={connectWallet} className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500">
            Connecter MetaMask
          </button>
        )}

        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500">
            + Add Player
          </button>
        )}

        <CreateCardModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} addCard={connectWallet} />

        {/* ✅ Affichage des cartes de l'utilisateur */}
        <h3 className="mt-8 text-2xl font-bold">Mes Cartes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {userCards.map((card) => (
            <div key={card.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img src={card.image} alt={card.name} className="w-full h-40 object-cover rounded-md" />
              <h4 className="mt-3 text-lg font-bold">{card.name} #{card.id}</h4>
              <p className="text-sm text-gray-400">Type: {card.type}</p>
              <p className="text-sm text-gray-400">Valeur: {card.value} ETH</p>
              <button
                onClick={() => toggleLockCard(card.id)}
                className={`mt-2 px-3 py-1 rounded text-white ${card.isLocked ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"}`}
              >
                {card.isLocked ? "Débloquer" : "Bloquer"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
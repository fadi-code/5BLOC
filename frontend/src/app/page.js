"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PlayerCardABI from "./SimplePlayerCard.json";
import CreateCardModal from "./components/CreateCardModal";
import Image from "next/image";

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
      fetchAllCards(contract);
      
    } catch (error) {
      console.error("🚨 Erreur lors de la connexion à MetaMask :", error);
    }
  };

  // Récupère les cartes de l'utilisateur connecté
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
              isLocked: card.isLocked,
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

  // ✅ Récupère toutes les cartes pour l'Admin
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

  const buyCard = async (cardId, price) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, PlayerCardABI.abi, signer);

        // Effectuer la transaction avec le montant en ETH requis
        const tx = await contract.buyCard(cardId, { value: ethers.parseEther(price.toString()) });
        await tx.wait();

        alert("✅ Achat réussi ! Vous êtes maintenant le propriétaire de cette carte.");
        connectWallet(); // Met à jour la liste des cartes après achat
    } catch (error) {
        console.error("🚨 Erreur lors de l'achat de la carte :", error);
        alert("⚠️ Impossible d'acheter cette carte.");
    }
};


  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen text-white px-8 py-6 relative overflow-hidden transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
      {/* Background animé */}
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 "></div>

      <div>
      {/* Contenu Principal */}
      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black">Manage Your Best Players</h2>

        {/* ✅ Affichage du compte, solde et rôle */}
        {account ? (

          <div className="mt-4 ">


        <p className="my-8 flex items-center justify-center space-x-4 text-black">
          <Image src="/fox.png" width={50} height={50} alt="Image locale" />
          <span className="text-xl font-bold">{account.slice(0, 6)}...{account.slice(-4)}</span>
        </p>

        <p className="text-center font-bold text-orange-500 text-lg">
          <strong>Solde :</strong> {userBalance} ETH
        </p>

          </div>
        ) : (
          <button onClick={connectWallet} className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500">
            Connecter MetaMask
          </button>
        )}

        {/* Bouton pour Ajouter un Joueur (Seulement Admin) */}
        {isAdmin && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 text-lg font-bold"
            >
              + Add New Player
            </button>
          </div>
        )}



  </div>



        

        {/* Modal pour Ajouter un Joueur */}
        <CreateCardModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} addCard={connectWallet} />

        {/* ✅ Affichage des cartes de l'utilisateur */}
        <h3 className="mt-8 text-2xl font-bold">Mes Cartes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-8 mt-4">
          {userCards.length > 0 ? (
            userCards.map((card) => (
              <div key={card.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img src={card.image} alt={card.name} className="w-full h-40 object-cover rounded-md " />
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
            ))
          ) : (
            <p className="text-gray-400">Aucune carte possédée.</p>
          )}
        </div>

        {/* ✅ Affichage de toutes les cartes pour l'Admin */}
          <div>
            <h3 className="mt-8 text-2xl font-bold">Toutes les Cartes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {allCards.length > 0 ? (
                allCards.map((card) => (
                  <div key={card.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                    <img src={card.image} alt={card.name} className="w-full h-40 object-cover rounded-md" />
                    <h4 className="mt-3 text-lg font-bold">{card.name} #{card.id}</h4>
                    <p className="text-sm text-gray-400">Type: {card.type}</p>
                    <p className="text-sm text-gray-400">Valeur: {card.value} ETH</p>
                    <p className="text-sm text-gray-500">Propriétaire: {card.owner.slice(0, 6)}...{card.owner.slice(-4)}</p>
                    {!card.isLocked && card.owner.toLowerCase() !== account.toLowerCase() && (
                        <button
                            onClick={() => buyCard(card.id, card.value)}
                            className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
                        >
                            Acheter pour {card.value} ETH
                        </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucune carte enregistrée.</p>
              )}
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Home;
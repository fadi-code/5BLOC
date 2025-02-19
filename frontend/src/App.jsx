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

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Installez MetaMask !");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    setAccount(accounts[0]);

    // Récupérer l'adresse du propriétaire du contrat
    const abi = PlayerCardABI.abi;
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const owner = await contract.getAdmin();
    setContractOwner(owner);

    // Récupérer le solde de l'utilisateur
    const balance = await provider.getBalance(accounts[0]);
    setUserBalance(ethers.formatEther(balance));

    // Vérifier si l'utilisateur est admin
    setIsAdmin(owner.toLowerCase() === accounts[0].toLowerCase());
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

      <CreateCardModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default App;
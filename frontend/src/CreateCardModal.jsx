import React, { useState } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { contractAddress, pinataApiKey, pinataSecretApiKey } from "./config";
import PlayerCardABI from "./SimplePlayerCard.json";

const CreateCardModal = ({ isOpen, closeModal }) => {
  const [name, setName] = useState("");
  const [cardType, setCardType] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "pinata_api_key": pinataApiKey,
        "pinata_secret_api_key": pinataSecretApiKey,
      },
      body: formData,
    });

    const data = await response.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  };

  const createCard = async () => {
    if (!window.ethereum) return alert("Connectez MetaMask !");

    setUploading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const abi = PlayerCardABI.abi;

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ipfsUri = await uploadToIPFS();

    const tx = await contract.addCard(name, cardType, value, ipfsUri);
    await tx.wait();

    setUploading(false);
    closeModal();
    alert("🎉 Carte créée avec succès !");
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <h2>Créer une Carte de Joueur</h2>
      <input type="text" placeholder="Nom du joueur" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Type (Attaquant, Défenseur...)" onChange={(e) => setCardType(e.target.value)} />
      <input type="text" placeholder="Valeur (ex: 90)" onChange={(e) => setValue(e.target.value)} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={createCard} disabled={uploading}>
        {uploading ? "Création..." : "Créer"}
      </button>
      <button onClick={closeModal}>Annuler</button>
    </Modal>
  );
};

export default CreateCardModal;
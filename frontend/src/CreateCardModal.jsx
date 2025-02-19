import React, { useState } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { contractAddress, jwt } from "./config";
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
    console.log(jwt);
    try {
      const formData = new FormData();
      formData.append("file", image); // L’image sélectionnée par l’utilisateur
  
      const request = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjY2Q2YTVkNC05ZmI4LTRlMTgtOWI1ZC1hNjg4MDliYjQ5Y2YiLCJlbWFpbCI6Im1lZG91c2UxNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiY2VjMjQ5MTI1YjM2M2IwODBhZmEiLCJzY29wZWRLZXlTZWNyZXQiOiI5ZWQxOGIwNjJjYmY2OWRmMWI5MzE3YjEzODE0ZDZkODU2Y2QyMzY4MTg2ZGUyYjM4OGE5MWU1MzFlNWQ0MDlmIiwiZXhwIjoxNzcxNTMyMjMwfQ.5OkLpJf2H7xCQ6reTtemJcvlhrwr_RbJxrv_-sKvK08`,
        },
        body: formData,
      });

      console.log("Envoi de l'image à IPFS...");
      console.log(request);

  
      if (!request.ok) {
        console.error("🚨 Erreur lors de l'upload IPFS :", await request.text());
        throw new Error("Échec de l'upload IPFS");
      }
  
      const response = await request.json();
      console.log("Upload réussi :", response);
      return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
    } catch (error) {
      console.error(" Erreur lors de l'upload IPFS :", error);
    }
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
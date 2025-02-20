import React, { useState } from "react";
import axios from "axios";
import { Contract, ethers } from "ethers";
import PlayerCardABI from "../SimplePlayerCard.json";

const CreateCardModal = ({ isOpen, closeModal, contractAddress, onCardAdded }) => {
  const [playerName, setPlayerName] = useState("");
  const [cardType, setCardType] = useState("attaquant");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) return alert("Veuillez sélectionner une image");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjY2Q2YTVkNC05ZmI4LTRlMTgtOWI1ZC1hNjg4MDliYjQ5Y2YiLCJlbWFpbCI6Im1lZG91c2UxNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiY2VjMjQ5MTI1YjM2M2IwODBhZmEiLCJzY29wZWRLZXlTZWNyZXQiOiI5ZWQxOGIwNjJjYmY2OWRmMWI5MzE3YjEzODE0ZDZkODU2Y2QyMzY4MTg2ZGUyYjM4OGE5MWU1MzFlNWQ0MDlmIiwiZXhwIjoxNzcxNTMyMjMwfQ.5OkLpJf2H7xCQ6reTtemJcvlhrwr_RbJxrv_-sKvK08`, // Stocke ton JWT Pinata dans .env.local
        },
      });

      const ipfsHash = response.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error("🚨 Erreur lors de l'upload IPFS :", error);
      setErrorMessage("Erreur lors de l'upload IPFS");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const addCardToBlockchain = async (imageUrl) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(contractAddress, PlayerCardABI.abi, signer);

      // Définition des valeurs des cartes selon leur type
      const cardValues = {
        attaquant: "10",
        milieu: "5",
        defenseur: "3",
        gardien: "7",
      };

      // Transaction blockchain
      const tx = await contract.addCard(playerName, cardType, cardValues[cardType], imageUrl);
      await tx.wait();

      alert("Carte ajoutée avec succès !");
    } catch (error) {
      console.error("🚨 Erreur lors de l'ajout de la carte sur la blockchain :", error);
      setErrorMessage("Erreur lors de l'ajout de la carte sur la blockchain.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const imageUrl = await handleImageUpload();
    if (imageUrl) {
      await addCardToBlockchain(imageUrl);
      closeModal();
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="absolute top-72  bg-gray-900 p-6 rounded-lg w-1/3">

        <h2 className="text-xl font-bold text-white">Ajouter un Joueur</h2>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Nom du joueur"
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          <select
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="attaquant">Attaquant</option>
            <option value="milieu">Milieu</option>
            <option value="defenseur">Défenseur</option>
            <option value="gardien">Gardien</option>
          </select>
          <input
            type="file"
            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500" disabled={isUploading}>
            {isUploading ? "Téléversement..." : "Ajouter Joueur"}
          </button>
        </form>

        <button onClick={closeModal} className="w-full mt-2 bg-red-600 text-white p-2 rounded hover:bg-red-500">
          Annuler
        </button>
      </div>
    </div>
  ) : null;
};

export default CreateCardModal;
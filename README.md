# 🏆 **SimplePlayerCard - Marketplace de Cartes NFT**  

Bienvenue dans **SimplePlayerCard**, un projet **Ethereum** permettant l'achat, la vente et la gestion de **cartes de joueurs** sous forme de **NFTs (ERC-721)**.  
Ce projet est conçu pour fonctionner avec **Hardhat**, **MetaMask** et un **réseau local** pour le développement et les tests.  

---

## 📌 **Description du Projet**  

**SimplePlayerCard** est un **contrat intelligent** permettant :  

✅ **L'ajout de cartes NFT** par l'administrateur.  
✅ **L'achat et la vente de cartes**, avec une **augmentation automatique du prix** après chaque transaction.  
✅ **Le verrouillage de cartes**, empêchant leur revente.  
✅ **Une gestion des restrictions** :  
   - **Maximum 10 cartes** par utilisateur.  
   - **Maximum 5 cartes verrouillées** par utilisateur.  
   - **Temps d'attente de 3 minutes** entre deux achats d'une même carte.  

---

## 🛠 **Prérequis**  

Avant de commencer, assurez-vous d'avoir installé :  

- 🟢 **Node.js** et **npm**   
- 🟢 **Hardhat**  
- 🟢 **MetaMask** (Extension pour interagir avec le contrat)  
- 🟢 **Un éditeur de code** (**VS Code** recommandé)  

---

## 🚀 **Installation et Configuration**  

### 🔹 **1️⃣ Cloner le projet**  
```sh
git clone https://github.com/fadi-code/5BLOC
cd 5BLOC

🔹 2️⃣ Installer les dépendances
```sh
npm i
🔹 3️⃣ Lancer un réseau local Hardhat
```sh

npx hardhat node
🔹 4️⃣ Déployer le contrat en local
Dans un autre terminal :

sh
Copier
Modifier
npx hardhat run scripts/deploy.js --network localhost
🔹 5️⃣ Configurer MetaMask
Ouvrir MetaMask et ajouter le réseau local :
Réseau : http://127.0.0.1:8545
Chaîne : 31337 (par défaut Hardhat)
Importer une clé privée générée par Hardhat :
sh
Copier
Modifier
npx hardhat node
Sélectionnez une des adresses affichées pour tester les transactions.
🔹 6️⃣ Interagir avec le contrat
Utiliser la console Hardhat :

sh
Copier
Modifier
npx hardhat console --network localhost
Exécuter des transactions en JavaScript avec ethers.js.

🎮 Fonctionnalités
✅ Ajouter une carte (admin seulement)
✅ Acheter une carte (en ETH, avec augmentation de prix automatique)
✅ Consulter les cartes possédées / disponibles
✅ Verrouiller / Déverrouiller une carte
✅ Vérifier le temps d’attente avant achat

🔐 Sécurité et Restrictions
⚠️ Un utilisateur ne peut pas acheter sa propre carte.
⚠️ Un maximum de 10 cartes par utilisateur.
⚠️ Un maximum de 5 cartes verrouillées.
⚠️ Un temps d’attente de 3 minutes entre deux achats de la même carte.

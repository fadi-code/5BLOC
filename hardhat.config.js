require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {}, // ✅ Réseau local déjà inclus
        localhost: {  // ✅ Ajout explicite du réseau local
            url: "http://127.0.0.1:8545"
        },
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19", // Changer à 0.8.19 pour correspondre à vos contrats
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA_URL || process.env.INFURA_SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        polygonMumbai: {
            url: process.env.ALCHEMY_MUMBAI_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};

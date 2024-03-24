require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",

  namedAccounts: {
    deployer: {
      default: 0, // ethers built in accounts at index 0
    },
  },

  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
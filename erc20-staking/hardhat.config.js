require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers")

/** @type import('hardhat/config').HardhatUserConfig */

const ETHER_API_KEY = process.env.ETHER_API_KEY ?? ""
const ARBITRUM_SEPOLIA_URL = process.env.ARBITRUM_SEPOLIA_URL ?? ""
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ""

module.exports = {
  solidity: "0.8.24",

  networks: {
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },

  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
  },

  sourcify: {
    enabled: true,
  },

  etherscan: {
    apiKey: ETHER_API_KEY,
    customChains: [
      {
        network: "arbsep",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  }
};
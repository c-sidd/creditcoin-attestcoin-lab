require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const privateKey = process.env.DEPLOYER_PRIVATE_KEY || process.env.CREDITCOIN_PRIVATE_KEY || process.env.SOURCE_DEPLOYER_PRIVATE_KEY;
const accounts = privateKey ? [privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`] : [];

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts
    },
    creditcoin: {
      url: process.env.CREDITCOIN_RPC_URL || "https://rpc.cc3-testnet.creditcoin.network",
      chainId: 102031,
      accounts
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

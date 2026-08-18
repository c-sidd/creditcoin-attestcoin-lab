import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./contracts/test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "",
      accounts: process.env.SOURCE_CHAIN_PRIVATE_KEY ? [process.env.SOURCE_CHAIN_PRIVATE_KEY] : [],
    },
    creditcoinTestnet: {
      url: process.env.CREDITCOIN_CC3_TESTNET_RPC_URL || "",
      accounts: process.env.CREDITCOIN_PRIVATE_KEY ? [process.env.CREDITCOIN_PRIVATE_KEY] : [],
    },
  },
};

export default config;

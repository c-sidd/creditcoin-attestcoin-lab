const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Starting deployment with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const networkName = hre.network.name;
  console.log("Target network:", networkName);

  // 1. Deploy SourceSignalEmitter (expected on Source Chain, e.g. Sepolia)
  console.log("\n--- Deploying SourceSignalEmitter ---");
  const SourceSignalEmitter = await hre.ethers.getContractFactory("SourceSignalEmitter");
  const source = await SourceSignalEmitter.deploy();
  await source.waitForDeployment();
  const sourceAddress = await source.getAddress();
  const sourceTx = source.deploymentTransaction();
  console.log("SourceSignalEmitter deployed to:", sourceAddress);
  console.log("Deployment Tx Hash:", sourceTx.hash);

  // 2. Deploy ProofMindAttestcoin (expected on Creditcoin CC3)
  console.log("\n--- Deploying ProofMindAttestcoin ---");
  const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin");
  const asc = await ProofMindAttestcoin.deploy(sourceAddress);
  await asc.waitForDeployment();
  const ascAddress = await asc.getAddress();
  const ascTx = asc.deploymentTransaction();
  console.log("ProofMindAttestcoin deployed to:", ascAddress);
  console.log("Deployment Tx Hash:", ascTx.hash);

  // 3. Deploy ProofMindDecision (expected on Creditcoin CC3)
  console.log("\n--- Deploying ProofMindDecision ---");
  // Default AI Signer is the deployer, but can be configured
  const aiSignerAddress = process.env.AI_SIGNER_ADDRESS || deployer.address;
  const ProofMindDecision = await hre.ethers.getContractFactory("ProofMindDecision");
  const decisionContract = await ProofMindDecision.deploy(ascAddress, aiSignerAddress);
  await decisionContract.waitForDeployment();
  const decisionAddress = await decisionContract.getAddress();
  const decisionTx = decisionContract.deploymentTransaction();
  console.log("ProofMindDecision deployed to:", decisionAddress);
  console.log("AI Signer Address set to:", aiSignerAddress);
  console.log("Deployment Tx Hash:", decisionTx.hash);

  // Save manifest
  const manifestPath = path.resolve(__dirname, "../../deployments/deployment_manifest.json");
  const manifest = {
    network: networkName,
    chainId: hre.network.config.chainId || 31337,
    timestamp: new Date().toISOString(),
    contracts: {
      SourceSignalEmitter: {
        address: sourceAddress,
        txHash: sourceTx.hash,
        deployer: deployer.address
      },
      ProofMindAttestcoin: {
        address: ascAddress,
        txHash: ascTx.hash,
        deployer: deployer.address,
        constructorArgs: [sourceAddress]
      },
      ProofMindDecision: {
        address: decisionAddress,
        txHash: decisionTx.hash,
        deployer: deployer.address,
        constructorArgs: [ascAddress, aiSignerAddress],
        aiSigner: aiSignerAddress
      }
    }
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("\nDeployment complete! Manifest written to:", manifestPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

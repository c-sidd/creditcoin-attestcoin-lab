const hre = require("hardhat");

async function main() {
  console.log("Starting Creditcoin Deployment...");

  const { network } = hre;
  console.log(`Network: ${network.name}`);

  // 1. Resolve Decoder Address
  let decoderAddress;
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("Deploying Mock EvmV1Decoder library on local network...");
    const EvmV1Decoder = await hre.ethers.getContractFactory("@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol:EvmV1Decoder");
    const decoder = await EvmV1Decoder.deploy();
    await decoder.waitForDeployment();
    decoderAddress = await decoder.getAddress();
    console.log(`EvmV1Decoder deployed to: ${decoderAddress}`);
  } else {
    decoderAddress = "0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f";
    console.log(`Using existing testnet Decoder address: ${decoderAddress}`);
  }

  // 2. Deploy ProofMindAttestcoin
  // For local tests/scaffold we can pass a dummy source contract address, in production we load it from env
  const sourceContractAddress = process.env.SOURCE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
  console.log(`Deploying ProofMindAttestcoin with Source Contract: ${sourceContractAddress}`);

  const ProofMindAttestcoin = await hre.ethers.getContractFactory("ProofMindAttestcoin", {
    libraries: {
      "@gluwa/usc-contracts/contracts/decoding/EvmV1Decoder.sol:EvmV1Decoder": decoderAddress,
    },
  });
  const attestcoin = await ProofMindAttestcoin.deploy(sourceContractAddress);
  await attestcoin.waitForDeployment();
  const attestcoinAddress = await attestcoin.getAddress();
  console.log(`ProofMindAttestcoin deployed to: ${attestcoinAddress}`);

  // 3. Deploy ProofMindDecision
  console.log(`Deploying ProofMindDecision pointing to Attestcoin: ${attestcoinAddress}`);
  const ProofMindDecision = await hre.ethers.getContractFactory("ProofMindDecision");
  const decision = await ProofMindDecision.deploy(attestcoinAddress);
  await decision.waitForDeployment();
  const decisionAddress = await decision.getAddress();
  console.log(`ProofMindDecision deployed to: ${decisionAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

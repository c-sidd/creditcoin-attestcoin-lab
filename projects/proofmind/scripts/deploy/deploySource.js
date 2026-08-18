const hre = require("hardhat");

async function main() {
  console.log("Deploying SourceSignalEmitter...");

  const SourceSignalEmitter = await hre.ethers.getContractFactory("SourceSignalEmitter");
  const emitter = await SourceSignalEmitter.deploy();

  await emitter.waitForDeployment();

  console.log("SourceSignalEmitter deployed to:", await emitter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

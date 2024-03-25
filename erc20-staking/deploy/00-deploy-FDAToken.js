const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const initialSupply = ethers.parseUnits("1000", 18);
  const FDAToken = await await hre.ethers.deployContract(
    "FDAToken",
    [initialSupply, deployer.address]
    );

  await FDAToken.waitForDeployment();
  const balance = await FDAToken.balanceOf(deployer.address);
  console.log(`Balance of ${deployer.address}: ${balance.toString()} tokens`);
  console.log(`Contract deployed to ${FDAToken.target}`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
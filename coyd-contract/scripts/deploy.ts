import { ethers } from "hardhat";

async function main() {
  const COYToken = await ethers.getContractFactory("COYToken")
  const coyToken = await COYToken.deploy();

  await coyToken.deployed();

  console.log(`COYToken Contract is deployed to ${coyToken.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
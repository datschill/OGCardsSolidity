const { ethers } = require("hardhat");

const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148' // Mainnet
// const reverseRegistrarAddress = '0x6f628b68b30dc3c17f345c9dbbb1e483c2b7ae5c' // Rinkeby
const registryWithFallbackAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

async function main() {
  // Deploy ENSHelper
  const ENSHelpers = await ethers.getContractFactory("ENSHelpers")
  ensHelpers = await ENSHelpers.deploy(reverseRegistrarAddress, registryWithFallbackAddress)
  await ensHelpers.deployed();
  console.log("ensHelpers deployed to:", ensHelpers.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

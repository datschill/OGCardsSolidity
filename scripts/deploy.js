const { ethers } = require("hardhat");

// const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148' // Mainnet
const reverseRegistrarAddress = '0x6f628b68b30dc3c17f345c9dbbb1e483c2b7ae5c' // Rinkeby
const registryWithFallbackAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'

async function main() {
  // Deploy ENSHelper
  const ENSHelpers = await ethers.getContractFactory("ENSHelpers")
  ensHelpers = await ENSHelpers.deploy(reverseRegistrarAddress, registryWithFallbackAddress)
  await ensHelpers.deployed();

  // Deploy Descriptors
  const FrontLayerDescriptorContract = await ethers.getContractFactory("FrontLayerDescriptor");
  frontLayerDescriptor = await FrontLayerDescriptorContract.deploy();
  await frontLayerDescriptor.deployed();

  const BackLayerDescriptorContract = await ethers.getContractFactory("BackLayerDescriptor");
  backLayerDescriptor = await BackLayerDescriptorContract.deploy();
  await backLayerDescriptor.deployed();

  const OGCardDescriptorContract = await ethers.getContractFactory("OGCardDescriptor");
  ogCardDescriptor = await OGCardDescriptorContract.deploy(frontLayerDescriptor.address, backLayerDescriptor.address);
  await ogCardDescriptor.deployed();

  // Deploy main contract
  const OGCardsContract = await ethers.getContractFactory("OGCards");
  ogCards = await OGCardsContract.deploy(cryptopunks, acb, purr, ensHelpers.address, ogCardDescriptor.address);
  await ogCards.deployed();

  console.log("OGCards deployed to:", ogCards.address);
  console.log("ogCardDescriptor deployed to:", ogCardDescriptor.address);
  console.log("backLayerDescriptor deployed to:", backLayerDescriptor.address);
  console.log("frontLayerDescriptor deployed to:", frontLayerDescriptor.address);
  console.log("ensHelpers deployed to:", ensHelpers.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

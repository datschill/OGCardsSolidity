// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148'
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

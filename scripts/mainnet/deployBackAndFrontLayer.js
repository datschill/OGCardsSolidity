const { ethers } = require("hardhat");

async function main() {
  // Deploy Descriptors
  const FrontLayerDescriptorContract = await ethers.getContractFactory("FrontLayerDescriptor");
  frontLayerDescriptor = await FrontLayerDescriptorContract.deploy();
  await frontLayerDescriptor.deployed();
  console.log("frontLayerDescriptor deployed to:", frontLayerDescriptor.address);

  const BackLayerDescriptorContract = await ethers.getContractFactory("BackLayerDescriptor");
  backLayerDescriptor = await BackLayerDescriptorContract.deploy();
  await backLayerDescriptor.deployed();
  console.log("backLayerDescriptor deployed to:", backLayerDescriptor.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

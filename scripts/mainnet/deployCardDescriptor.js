const { ethers } = require("hardhat");

const frontLayerAddress = '0xf63cCF6f7EF7E8F225271758df74f252beCd4CAc'
const backLayerAddress = '0x85D9C980AC674e36bCa9A5e8bD8Ff419F7B4E46B'

async function main() {
    const OGCardDescriptorContract = await ethers.getContractFactory("OGCardDescriptor");
    ogCardDescriptor = await OGCardDescriptorContract.deploy(frontLayerAddress, backLayerAddress);
    await ogCardDescriptor.deployed();
    console.log("ogCardDescriptor deployed to:", ogCardDescriptor.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

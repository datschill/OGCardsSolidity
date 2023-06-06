const { ethers } = require("hardhat");

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'

async function main() {
    let ensHelpersAddress
    let frontLayerAddress
    let backLayerAddress
    let ogCardsDescriptorAddress
    ensHelpersAddress = '0x28F6AbFcEf4d3D3003245EDbE6B3DBF4760319EB'
    frontLayerAddress = '0x6cd65B24103dacEb286350932507DCBE29CbA55e'
    backLayerAddress = '0x733693914ccf669FB2e76beA378a90dd1528B1cA'
    ogCardsDescriptorAddress = '0x38C7491AEbC95B1E3a52d8974405C73a18742a48'

    const OGCardDescriptorContract = await ethers.getContractFactory("OGCardDescriptor");
    ogCardDescriptor = await OGCardDescriptorContract.deploy(frontLayerAddress, backLayerAddress);
    await ogCardDescriptor.deployed();
    console.log("ogCardDescriptor deployed to:", ogCardDescriptor.address);
    ogCardsDescriptorAddress = ogCardDescriptor.address

    // Deploy main contract
    const OGCardsContract = await ethers.getContractFactory("OGCards");
    ogCards = await OGCardsContract.deploy(cryptopunks, acb, purr, ensHelpersAddress, ogCardsDescriptorAddress);
    await ogCards.deployed();
    console.log("OGCards deployed to:", ogCards.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

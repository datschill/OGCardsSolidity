const { ethers } = require("hardhat");

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'

const ensHelpersAddress = '0x3b85bAF0E2157183C68D7143CddaCB4eed75E0a1'
const ogCardsDescriptorAddress = '0x009b8727B61db4D9EE59b102Df53e5e30E8B14e5'

async function main() {
    let gasLimit = 8000000
    // Deploy main contract
    const OGCardsContract = await ethers.getContractFactory("OGCards");
    ogCards = await OGCardsContract.deploy(cryptopunks, acb, purr, ensHelpersAddress, ogCardsDescriptorAddress, {gasLimit});
    await ogCards.deployed();
    console.log("OGCards deployed to:", ogCards.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

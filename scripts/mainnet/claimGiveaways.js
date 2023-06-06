const { ethers } = require("hardhat");

async function main() {
  await batch()
}

async function batch() {
  const OGCardsContract = await ethers.getContractFactory("OGCards");
  const ogCards = await OGCardsContract.attach(
      "0x96AaF5008913C3Ae12541f6ea7717c9A0DD74F4d" // The deployed contract address
  );
  let address = [
    // '0xd6a984153aCB6c9E2d788f08C2465a1358BB89A7', DONE
    // '0xD387A6E4e84a6C86bd90C158C6028A58CC8Ac459', DONE
    // '0x0F0eAE91990140C560D4156DB4f00c854Dc8F09E', DONE
    // '0x442DCCEe68425828C106A3662014B4F131e3BD9b', DONE
    // '0x1e32a859d69dde58d03820F8f138C99B688D132F' DONE
  ]
  for (i=0; i< address.length; i++) {
    let a = address[i]
    console.log('Giveaway for ', a)
    // Mint a giveaway card
    await ogCards.giveawayClaim(a, 0)
    console.log('Giveaway SENT for ', a)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

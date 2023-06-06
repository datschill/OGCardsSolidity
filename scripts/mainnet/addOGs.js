const { ethers } = require("hardhat");

async function main() {
  await addNineNextOGs()
}

async function addSevenNextOGs() {
  const OGCardsContract = await ethers.getContractFactory("OGCards");
  const ogCards = await OGCardsContract.attach(
      "0x96AaF5008913C3Ae12541f6ea7717c9A0DD74F4d" // The deployed contract address
  );
  let ogsAddress = [
    '0xd6a984153aCB6c9E2d788f08C2465a1358BB89A7',
    '0xD387A6E4e84a6C86bd90C158C6028A58CC8Ac459',
    '0x0F0eAE91990140C560D4156DB4f00c854Dc8F09E',
    '0x442DCCEe68425828C106A3662014B4F131e3BD9b',
    '0x1e32a859d69dde58d03820F8f138C99B688D132F',
    '0xf97664376416E9379f2354DB444BFE3f00B6936b',
    '0xe16c0E1Bf3B75F67E83C9e47B9c0Eb8Bf1B99CCd',
  ]

  let ogsNames = [
    'GaryVee',
    'Pranksy',
    'VincentVanDough',
    'j1mmy',
    'straybits',
    'Fiskantes',
    '0xtuba'
  ]
  // Add OGs
  await ogCards.addOGs(ogsAddress, ogsNames)
}

async function addNineNextOGs() {
  const OGCardsContract = await ethers.getContractFactory("OGCards");
  const ogCards = await OGCardsContract.attach(
      "0x96AaF5008913C3Ae12541f6ea7717c9A0DD74F4d" // The deployed contract address
  );
  let ogsAddress = [
    '0x63a9dbCe75413036B2B778E670aaBd4493aAF9F3',
    '0x7BeF8662356116cb436429F47e53322B711F4E42',
    '0x2eB5e5713A874786af6Da95f6E4DEaCEdb5dC246',
    '0x0b8F4C4E7626A91460dac057eB43e0de59d5b44F',
    '0xc6b0562605D35eE710138402B878ffe6F2E23807',
    '0x34aA3F359A9D614239015126635CE7732c18fDF3',
    '0x1DA5331994e781AB0E2AF9f85bfce2037A514170',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    '0x2B3Ab8e7BB14988616359B78709538b10900AB7D'
  ]

  let ogsNames = [
    'NateAlex',
    'TheArtchitech',
    'cobie',
    'artchick',
    'Beeple',
    'AustinGriffith',
    'DANNY',
    'Vitalik',
    'Poopie'
  ]
  // Add OGs
  await ogCards.addOGs(ogsAddress, ogsNames)
}

async function addFirstOGsAndMintCarlini8() {
  const OGCardsContract = await ethers.getContractFactory("OGCards");
  const ogCards = await OGCardsContract.attach(
      "0x96AaF5008913C3Ae12541f6ea7717c9A0DD74F4d" // The deployed contract address
  );

  let addr0xd0s = '0xf57178918BB20587CD689c285E3c8deaFBE65dDa'
  let addrCarlini8 = '0x0d41F957181E584dB82d2E316837B2DE1738C477'
  let ogsAddress = [
    addr0xd0s,
    addrCarlini8
  ]

  let ogsNames = [
    '0xd0s',
    'Carlini8'
  ]
  // Add OGs
  await ogCards.addOGs(ogsAddress, ogsNames)
  // Mint a giveaway card for Carlini8
  await ogCards.giveawayClaim(addrCarlini8, 3)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

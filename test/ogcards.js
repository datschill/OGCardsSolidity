const { expect } = require("chai");
const { ethers } = require("hardhat");

const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148'
const registryWithFallbackAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'

describe("OGCards - OGs",  function () {
    let ensHelpers
    let frontLayerDescriptor
    let backLayerDescriptor
    let ogCardDescriptor
    let ogCards
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let ogName = 'Second'

    before(async () => {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

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
    })
  
    beforeEach(async function () {
        // Deploy main contract
        const OGCardsContract = await ethers.getContractFactory("OGCards");
        ogCards = await OGCardsContract.deploy(cryptopunks, acb, purr, ensHelpers.address, ogCardDescriptor.address);
        await ogCards.deployed();

        // Set addr2 as an OG
        await ogCards.addOG(addr2.address, ogName)
    });
    
    it("Should show metadata #004", async () => {
        await ogCards.transferFrom(owner.address, addr1.address, 4);
        // await ogCards.addOG(addr1.address, 'Second');
        // await ogCards.addOG(owner.address, 'Owner');
        await ogCards.addOG(addr2.address, 'Third');
        await ogCards.addOG(addrs[0].address, 'Fourth');

        await ogCards.connect(addr1).transferFrom(addr1.address, addr2.address, 4);
        await ogCards.connect(addr2).transferFrom(addr2.address, addrs[0].address, 4);
        await ogCards.connect(addrs[0]).transferFrom(addrs[0].address, owner.address, 4);
        let metadata4 = await ogCardDescriptor.metadata(ogCards.address, 4)
        console.log('metadata Punk GA', metadata4)

        expect(1).to.equal(1);
    })
  });
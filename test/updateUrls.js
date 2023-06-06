const { expect } = require("chai");
const { ethers } = require("hardhat");

const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148'
const registryWithFallbackAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'


describe("OGCards - Update URLs",  function () {
    let ensHelpers
    let frontLayerDescriptor
    let backLayerDescriptor
    let ogCardDescriptor
    let ogCards
    let owner;
    let addr1;
    let addr2;
    let addrs;

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
    });

    it("Should be able to update the BackLayerDescriptor address", async () => {
        await ogCardDescriptor.setBackLayerDescriptor(addr2.address)
        expect(await ogCardDescriptor.backLayerDescriptor()).to.equal(addr2.address);
    })
    it("Should be able to update the ogCardURL", async () => {
        let ogCardUrl = 'ogcard.art'
        await ogCardDescriptor.setOGCardUrl(ogCardUrl)
        expect(await ogCardDescriptor.ogCardUrl()).to.equal(ogCardUrl);
    })
    it("Should be able to update the ogCardDescription", async () => {
        let ogCardDescription = 'OGCards description'
        await ogCardDescriptor.setOGCardDescription(ogCardDescription)
        expect(await ogCardDescriptor.ogCardDescription()).to.equal(ogCardDescription);
    })
  });
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

    it("An address should become OG", async () => {
        // addr1 not an OG
        expect(await ogCards.isOG(addr1.address)).to.equal(false);
        // addr2 is an OG
        expect(await ogCards.isOG(addr2.address)).to.equal(true);
        // addr2 name = OG name
        expect(await ogCards.holderName(addr2.address)).to.equal(ogName);
    })
    it("Should be able to remove an OG", async () => {
        await ogCards.removeOG(addr2.address)
        // addr2 no longer an OG
        expect(await ogCards.isOG(addr2.address)).to.equal(false);
        let holderName = await ogCards.holderName(addr2.address)
        // Name = address.slice(0,8)
        expect(holderName.length).to.equal(8);
    })
    it("Should have the exact number of OG holders", async () => {
        await ogCards.addOG(addr1.address, 'First')
        await ogCards.transferFrom(owner.address, addr1.address, 0)
        await ogCards.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
        await ogCards.connect(addr2).transferFrom(addr2.address, addrs[0].address, 0)
        // Resend it to a previous og holder
        await ogCards.connect(addrs[0]).transferFrom(addrs[0].address, addr1.address, 0)

        let card = await ogCards.cardDetails(0)
        // 4 holders
        expect(card.holders.length).to.equal(4)

        let ogHolders = await ogCards.ogHolders(0)
        let holdersAddress = ogHolders[0]
        // Exactly 2 OGs
        expect(holdersAddress.length).to.equal(2)
        // First OG = addr1
        expect(holdersAddress[0]).to.equal(addr1.address)
        // Second OG = addr2
        expect(holdersAddress[1]).to.equal(addr2.address)
        // Second OG name correct
        expect(ogHolders[1][1]).to.equal(ogName)
    })
    it("Should be OGs", async () => {
        let addr1Name = "Name 1"
        let addr_0Name = "Name 2"
        await ogCards.addOGs([addr1.address, addrs[0].address], [addr1Name, addr_0Name])
        // addr1 is an OG
        expect(await ogCards.isOG(addr1.address)).to.equal(true);
        // addrs[0] is an OG
        expect(await ogCards.isOG(addrs[0].address)).to.equal(true);
    })
  });
const { expect } = require("chai");
const { ethers } = require("hardhat");

const reverseRegistrarAddress = '0x084b1c3c81545d370f3634392de611caabff8148'
const registryWithFallbackAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

const cryptopunks = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
const acb = '0x69c40e500b84660cb2ab09cb9614fa2387f95f64'
const purr = '0x9759226b2f8ddeff81583e244ef3bd13aaa7e4a1'

describe("OGCards - PublicClaim",  function () {
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

    it("Owner should have 14 cards", async () => {
        expect(await ogCards.balanceOf(owner.address)).to.equal(14);
    })

    it("Should be impossible to mint if the claiming is not opened", async () => {
        await expect(
            ogCards.connect(addr1).claim()
        ).to.be.revertedWith("OGCards: claim is not opened yet");

        // addr1 balance shouldn't have changed.
        expect(await ogCards.balanceOf(addr1.address)).to.equal(0);
    })
    it("Should be possible to mint if the claiming is opened", async () => {
        await ogCards.switchClaimOpened()
        await ogCards.connect(addr1).claim()
        expect(await ogCards.balanceOf(addr1.address)).to.equal(1);
    })
    it("Should be possible to mint GA cards even if the claiming is not opened", async () => {
        await expect(
            ogCards.giveawayClaim(addr1.address, 2)
        ).to.not.be.revertedWith("OGCards: claim is not opened yet");
        expect(await ogCards.balanceOf(addr1.address)).to.equal(1);
    })
    it("There should be 249 base cards left after the first claim", async () => {
        await ogCards.switchClaimOpened()
        await ogCards.connect(addr1).claim()
        expect(await ogCards.baseCardsLeft()).to.equal(249);
    })
    it("Should be able to claim only once", async () => {
        await ogCards.switchClaimOpened()
        await ogCards.connect(addr1).claim()
        await expect(
            ogCards.connect(addr1).claim()
        ).to.be.revertedWith("OGCards: you already claimed a base card");
        expect(await ogCards.balanceOf(addr1.address)).to.equal(1);
    })
  });
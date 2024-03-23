const { expect } = require("chai");
const { ethers } = require("hardhat");

const token = (n) => {
  return ethers.utils.parseEther(n.toString());
};

describe("escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    // setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    //  Deploy Real Estate
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    // Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    // Deploy escrow contract
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );

    // Approve Property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);

    // List property
    transaction = await escrow.connect(seller).list(1);
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("returns the nft Address", async () => {
      const result = await escrow.nftAddress();
      console.log("nft Address", result);
      expect(result).to.be.equal(realEstate.address);
    });

    it("returns the seller address", async () => {
      const result = await escrow.seller();
      console.log("seller Address", result);
      expect(result).to.be.equal(seller.address);
    });

    it("returns the inspector address", async () => {
      const result = await escrow.inspector();
      console.log("inspector Address", result);
      expect(result).to.be.equal(inspector.address);
    });

    it("returns the lender address", async () => {
      const result = await escrow.lender();
      console.log("lender Address", result);
      expect(result).to.be.equal(lender.address);
    });
  });

  describe("Listing", () => {
    it("Updates Ownership", async () => {
      console.log("real estate owner ", await realEstate.ownerOf(1));
      console.log("escrow owner ", escrow.address);
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
  });
});

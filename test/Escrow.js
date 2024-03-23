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
    transaction = await escrow
      .connect(seller)
      .list(1, buyer.address, token(10), token(5));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("returns the nft Address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
    });

    it("returns the seller address", async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
    });

    it("returns the inspector address", async () => {
      const result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
    });

    it("returns the lender address", async () => {
      const result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
    });
  });

  describe("Listing", () => {
    it("Updates Ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });

    it("Updates is Listed", async () => {
      const result = await escrow.isListed(1);
      expect(result).to.be.equal(true);
    });

    it("Returns the Buyer", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address);
    });

    it("Returns Purchase Price", async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.be.equal(token(10));
    });

    it("Returns the Escrow Amount", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.be.equal(token(5));
    });
  });

  describe("Deposits", () => {
    it("Updates the contract Balance", async () => {
      const transaction = await escrow
        .connect(buyer)
        .depositErnest(1, { value: token(5) });
      await transaction.wait();
      const result = await escrow.getBalance();
      expect(result).to.be.equal(token(5));
    });
  });
});

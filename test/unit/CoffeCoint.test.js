const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("CoffeCoin unit test", async function () {
          let deployer,
              coffeCoin,
              chainId,
              merkleRoot,
              accounts,
              owner,
              allowlistedUser,
              proofUser,
              indexUser,
              amountUser,
              proofUser2,
              indexUser2,
              amountUser2,
              proofOwner,
              allowlistedUser2,
              notAllowlistedUser
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["coffeCoin"])
              coffeCoin = await ethers.getContract("CoffeCoin", deployer)
              chainId = network.config.chainId
              accounts = await ethers.getSigners()
              owner = accounts[0]
              allowlistedUser = accounts[1]
              allowlistedUser2 = accounts[2]
              notAllowlistedUser = accounts[3]
              merkleRoot = "0x00cc0682ee424631b39870b228f6e7f43608ae8aaabc7602bb815e3b9eff214c"
              proofUser = [
                  "0xb6354da3efba96ad386ebd3a51f813f0f07118a88b2516a29b415356cd174618",
                  "0x6c2dfa653138194f790f2644203a04f02541a00ef5ba159730542938edd94621",
                  "0xeed5219491412f058abd9d5546e4efdca0c42e6ab9e035c199d79e020a874e4c",
                  "0xf6dd3b706d7b0be9ea378717a886f015b525e73d84e8dfe18ccc2bc573e8cf5b",
              ]
              indexUser = "11"
              amountUser = "20000000000000000000000"
              proofUser2 = [
                  "0xc388c8e06ba98b7e4afcaccddc65db8ec137609363311693f840c21ec8a30316",
                  "0x6c2dfa653138194f790f2644203a04f02541a00ef5ba159730542938edd94621",
                  "0xeed5219491412f058abd9d5546e4efdca0c42e6ab9e035c199d79e020a874e4c",
                  "0xf6dd3b706d7b0be9ea378717a886f015b525e73d84e8dfe18ccc2bc573e8cf5b",
              ]
              indexUser2 = "9"
              amountUser2 = "50000000000000000000000"
              indexOwner = "10"
              amountOwner = "50000000000000000000000"
              proofOwner = [
                  "0x3abfde5fdfd0f7a3a2c48db4b1147ce7e08ca84788e0ffec15224d8abc714574",
                  "0xd72dc11f58846cc90e43f39ba5e44988ecec10339bd4a0a5099a5295fefb92e8",
                  "0x5fea44d8f49cbadcbef9b7fd49e35aac37e4a97fecbdc480c7763d2d7be31175",
                  "0xf6dd3b706d7b0be9ea378717a886f015b525e73d84e8dfe18ccc2bc573e8cf5b",
              ]
          })
          describe("Function: constructor", function () {
              it("Should mint the maxSupply - maxSupplyAllowlist amount of tokens", async function () {
                  assert.equal(
                      BigInt(await coffeCoin.balanceOf(owner.address)),
                      BigInt(networkConfig[chainId].maxSupply) -
                          BigInt(networkConfig[chainId].maxSupplyAllowlist),
                  )
              })
              it("Sets the constructor parameters correctly", async function () {
                  assert.equal(await coffeCoin.name(), "CoffeCoin")
                  assert.equal(await coffeCoin.symbol(), "CFC")
                  assert.equal(await coffeCoin.getMaxSupply(), networkConfig[chainId].maxSupply)
              })
          })
          describe("Function: mintTokensAllowlist", function () {
              it("Should revert if already claimed", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint tokens #1
                  await coffeCoin
                      .connect(allowlistedUser)
                      .mintTokensAllowlist(proofUser, indexUser, amountUser)
                  // mint tokens #2
                  await expect(
                      coffeCoin
                          .connect(allowlistedUser)
                          .mintTokensAllowlist(proofUser, indexUser, amountUser),
                  ).to.be.reverted
              })
              it("Should revert if the max supply is reached", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint with user #1
                  await coffeCoin
                      .connect(allowlistedUser2)
                      .mintTokensAllowlist(proofUser2, indexUser2, amountUser2)
                  // mint with user #2
                  await expect(
                      coffeCoin
                          .connect(allowlistedUser)
                          .mintTokensAllowlist(proofUser, indexUser, amountUser),
                  ).to.be.reverted
              })
              it("Should set the index in Bitmap to true", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // check if the bit at the user index is false
                  assert.equal(await coffeCoin.getBitMaps(indexUser2), false)
                  // mint with user
                  await coffeCoin
                      .connect(allowlistedUser2)
                      .mintTokensAllowlist(proofUser2, indexUser2, amountUser2)
                  // check if the bit at the user index is true
                  assert.equal(await coffeCoin.getBitMaps(indexUser2), true)
              })
              it("Should mint the amount of tokens defined in the merkle proof", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint with user
                  await coffeCoin
                      .connect(allowlistedUser2)
                      .mintTokensAllowlist(proofUser2, indexUser2, amountUser2)
                  // check if the amount of minted tokens is the same as was defined in the merkle proof
                  assert.equal(await coffeCoin.balanceOf(allowlistedUser2.address), amountUser2)
              })
          })
          describe("Function: verify", function () {
              it("Should revert if the address is not allowlisted", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint with not allowlisted user
                  await expect(
                      coffeCoin
                          .connect(notAllowlistedUser)
                          .mintTokensAllowlist(proofUser2, indexUser2, amountUser2),
                  ).to.be.reverted
              })
              it("Should revert if the index is wrong", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint with not allowlisted user
                  //   await coffeCoin
                  //       .connect(allowlistedUser2)
                  //       .mintTokensAllowlist(proofUser2, indexUser2 - 1, amountUser2)
                  await expect(
                      coffeCoin
                          .connect(allowlistedUser2)
                          .mintTokensAllowlist(proofUser2, indexUser2 - 1, amountUser2),
                  ).to.be.reverted
              })
              it("Should revert if the amount is wrong", async function () {
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  // mint with not allowlisted user
                  //   await coffeCoin
                  //       .connect(allowlistedUser2)
                  //       .mintTokensAllowlist(proofUser2, indexUser2, "49999999999999999999999")
                  await expect(
                      coffeCoin
                          .connect(allowlistedUser2)
                          .mintTokensAllowlist(proofUser2, indexUser2, "49999999999999999999999"),
                  ).to.be.reverted
              })
          })
          describe("Function: updateMerkleRoot", function () {
              it("Should update the merkle root", async function () {
                  // check if the root is empty before update
                  assert.equal(
                      await coffeCoin.getRoot(),
                      "0x0000000000000000000000000000000000000000000000000000000000000000",
                  )
                  // update merkle tree root
                  await coffeCoin.connect(owner).updateMerkleRoot(merkleRoot)
                  assert.equal(await coffeCoin.getRoot(), merkleRoot)
              })
          })
      })

// this script updates the merkle root on Sepolia network
// copy the new root to the newRoot variable
// can only be called by the owner
// run with "yarn hardhat run scripts/updateMerkleTreeRoot.js --network sepolia"

const { ethers } = require("hardhat")

async function updateMerkleRoot() {
    const newRoot = "0x00cc0682ee424631b39870b228f6e7f43608ae8aaabc7602bb815e3b9eff214c"

    const coffeCoin = await ethers.getContract("CoffeCoin")
    const oldRoot = await coffeCoin.getRoot()
    await coffeCoin.updateMerkleRoot(newRoot)

    console.log("--------------------------------------")
    console.log(`Merkle root updated`)
    console.log(`from: ${oldRoot}`)
    console.log(`to: ${newRoot}`)
    console.log("--------------------------------------")
}

updateMerkleRoot()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

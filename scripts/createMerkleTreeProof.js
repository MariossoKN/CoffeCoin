// this script creates the proofs for the inserted address (line 10)
// the create merkle tree script has to be run first and the tree.json has to be created
// to run this script run this in the terminal: yarn hardhat run scripts/createMerkleTreeProof.js

const { StandardMerkleTree } = require("@openzeppelin/merkle-tree")
const fs = require("fs")

const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")))

for (const [i, v] of tree.entries()) {
    if (v[0] === "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC") {
        const proof = tree.getProof(i)
        console.log("Value:", v)
        console.log("Proof:", proof)
    }
}

/**
 * Merkle Tree Proof Generation Script
 *
 * This script is used to generate a Merkle Tree proof for the specified address. It loads the
 * pre-generated Merkle Tree and extracts the proof for the specified address.
 *
 * To use this script:
 * - Ensure that the Merkle Tree JSON file 'tree.json' is generated.
 * - Specify the target address you want to generate a proof for in the 'if' condition.
 * - Run the script using: yarn hardhat run scripts/createMerkleTreeProof.js.
 */

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

// this script creates a merkle tree of defined values. It also creates a tree.json file with the merkle data
// to run this script run this in the terminal: yarn hardhat run scripts/createMerkleTree.js

const { StandardMerkleTree } = require("@openzeppelin/merkle-tree")
const fs = require("fs")

// here you put the allowlisted addresses, index for the Bitmaps and amount of tokens for mint
const values = [
    ["0x0000000000000000000000000000000000000001", "0", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000002", "1", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000003", "2", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000004", "3", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000005", "4", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000006", "5", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000007", "6", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000008", "7", "5000000000000000000"],
    ["0x0000000000000000000000000000000000000009", "8", "5000000000000000000"],
    ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "9", "50000000000000000000000"],
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "10", "50000000000000000000000"],
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "11", "20000000000000000000000"],
]

const tree = StandardMerkleTree.of(values, ["address", "uint256", "uint256"])

console.log("Merkle Root:", tree.root)

fs.writeFileSync("tree.json", JSON.stringify(tree.dump()))

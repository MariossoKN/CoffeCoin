const networkConfig = {
    11155111: {
        name: "sepolia",
        requestConfirmations: "3",
        maxSupply: "1000000000000000000000000",
        maxSupplyAllowlist: "50000000000000000000000",
    },
    31337: {
        name: "hardhat",
        requestConfirmations: "3",
        maxSupply: "100000000000000000000000",
        maxSupplyAllowlist: "50000000000000000000000",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains }

const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const maxSupply = networkConfig[chainId].maxSupply
    const maxSupplyAllowlist = networkConfig[chainId].maxSupplyAllowlist
    const blockConfirmations = network.config.blockConfirmations

    const args = [maxSupply, maxSupplyAllowlist]

    const coffeCoin = await deploy("CoffeCoin", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: blockConfirmations,
    })

    // Contract verification
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(coffeCoin.address, args)
    }

    console.log(`Contract address: ${coffeCoin.address}`)
    console.log("**********************************************************************")
}
module.exports.tags = ["all", "coffeCoin"]

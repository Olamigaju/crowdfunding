const { network, ethers } = require("hardhat")
const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { verify } = require("../utilis/verify")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //if chainID is A use address B
    //if chainID is x use address Y
    //const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]

    let ethUSDPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")

        ethUSDPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]
    }

    //what happen when we want to change a chain
    //when going for localhost or hardhat we want to use a mock
    const args = [ethUSDPriceFeedAddress]

    const fundMe = await deploy("fundMe", {
        from: deployer,
        log: true,
        args: args, //here we put our pricefeed address here,we can list of account
        blockWait: network.config.blockConfirmations || 1,
    })
    if (!developmentChain.includes(network.name)) {
        verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]

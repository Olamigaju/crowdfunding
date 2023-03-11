const { network } = require("hardhat")
const {
    developmentChain,
    DECIMAL,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChain.includes(network.name)) {
        log("local network detected! Deploying Mock...........")
        await deploy("MockV3Aggregator", {
            contracts: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMAL, INITIAL_ANSWER],
        })
        log("Mock deployed")
        log("_______________________________")
    }
}

module.exports.tags = ["all", "mocks"]

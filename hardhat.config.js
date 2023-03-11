require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-ethers")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.14",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL || "",
            chainId: 5,
            accounts: [PRIVATE_KEY] || "",
            blockConfirmations: 6 || 1,
        },
        localHot: {
            url: "http://127.0.0.1:8545/" || "",
            chainId: 31337,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
    //     gasReporter: {
    //         enable: false,
    //         outputFile: "'gasReport.txt",
    //         noColors: true,
    //         currency: "USD",
    //         coinmarketCap: COINMARKETCAP_API_KEY,
    //         token: "MATIC",
    //     },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
}

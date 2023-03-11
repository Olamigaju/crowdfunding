const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("fundMe", deployer)
    console.log("withdrawn from contract.......")
    const transactionResponse = await fundMe.withdrawn()
    await transactionResponse.wait("1")
    console.log("'fund withdrawn.........")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

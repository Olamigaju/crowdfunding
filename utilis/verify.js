const { run } = require("hardhat")
async function verify(contractAddress, arg) {
    console.log("verying contract......")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArg: arg,
        })
        // e represent error it throws
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Veriefied!")
        } else {
            console.log(e)
        }
    }
}
module.exports = {
    verify,
}

const { assert } = require("chai")
const { getNamedAccounts, network, ethers } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")

developmentChain.includes(network.name)
    ? describe.skip
    : decribe("fundMe", function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundme = await ethers.getContract("fundMe", deployer)
          })
          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdrawn()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), 0)
          })
      })

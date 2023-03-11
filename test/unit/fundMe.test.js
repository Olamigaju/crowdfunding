const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChain } = require("../../helper-hardhat-config")
developmentChain.includes(network.name)
    ? describe.skip
    : describe("fundMe", function () {
          let fundMe
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture("all")
              fundMe = await ethers.getContract("fundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", function () {
              it("set the aggregator addresses correctly", async function () {
                  const response = await fundMe.priceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })
          describe("fund", function () {
              it("fails if you don't send Enough Ether", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "the Minimium is 5 USD worth of ETH"
                  )
              })
              it("update the amount funded structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("add funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.funders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdrawn", function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw from a single funder", async function () {
                  //arrange
                  const startingFundmeBalance =
                      await ethers.provider.getBalance(
                          fundMe.address
                          //assuming balance is 0
                      )
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(
                          deployer
                          //assuming balance is 3
                      )
                  //

                  const transactionResponse = await fundMe.withdrawn()
                  const transactionReceipt = await transactionResponse.wait("1")
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //after withdrawing the balance the fundMe goesback to 0
                  const endingFundmeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  //And the deployer balance becomes 3 i.e (startingfundme + startingDeployer)
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("allows to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()

                  for (let i = 1; 1 < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  //arrange
                  const startingFundmeBalance =
                      await ethers.provider.getBalance(
                          fundMe.address
                          //assuming balance is 0
                      )
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(
                          deployer
                          //assuming balance is 3
                      )
                  const transactionResponse = await fundMe.withdrawn()
                  const transactionReceipt = await transactionResponse.wait("1")
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //after withdrawing the balance the fundMe goesback to 0
                  const endingFundmeBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  //And the deployer balance becomes 3 i.e (startingfundme + startingDeployer)
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  assert.equal(endingFundmeBalance, 0)
                  assert.equal(
                      startingFundmeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
                  //let make sure the funders are reset properly
                  await expect(fundMe.funders(0)).to.be.reverted
                  for (let i = 1; 1 < 6; i++) {
                      assert.equal(
                          await fundMe.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only owner can withdrawn", async function () {
                  const accounts = await ethers.getSigners()
                  const attackers = accounts[1]
                  const attackersConnect = fundMe.connect(attackers)
                  await expect(attackersConnect.withdrawn()).to.be.reverted
              })
          })
      })

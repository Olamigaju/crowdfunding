//SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "./priceConverter.sol";

contract fundMe {
    using priceConverter for uint256;

    address[] public funders;
    uint256 MINIMUMUSD = 5 * 1e18;
    address public owner;

    mapping(address => uint256) addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddr) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddr);
    }

    function fund() public payable {
        //want to be able to set a minimu fund amount
        //msg.value.getConversionRate();
        //getConversionRate(msg.value)
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUMUSD,
            "the Minimium is 5 USD worth of ETH"
        );

        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function withdrawn() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //this will reset the funders back to zer[]
        funders = new address[](0);
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "failed");
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "sender is not the owner");
        _;
    }

    fallback() external {
        fund();
    }
}

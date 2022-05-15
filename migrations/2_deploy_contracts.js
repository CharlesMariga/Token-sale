const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

// Token price is 0.001 Ether
const tokenPrice = 1000000000000000;

module.exports = async function (deployer) {
  await deployer.deploy(DappToken, 1000000);
  await deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
};

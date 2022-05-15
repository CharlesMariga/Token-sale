const DappTokenSale = artifacts.require("DappTokenSale.sol");

let tokeSaleInstance;
let tokenPrice = 1000000000000000;
beforeEach(async () => {
  tokeSaleInstance = await DappTokenSale.deployed();
});

contract("DappTokenSale", function (accounts) {
  it("initializes the contract with the correct values", async function () {
    let address = await tokeSaleInstance.address;
    assert.notEqual(address, 0x0, "doesn't have a contract address");
    address = await tokeSaleInstance.tokenContract();
    assert.notEqual(address, 0x0, "has token contract address");
    const price = await tokeSaleInstance.tokenPrice();
    assert.equal(price, tokenPrice, "token price is not set correctly");
  });
});

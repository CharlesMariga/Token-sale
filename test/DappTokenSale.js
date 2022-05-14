const DappTokenSale = artifacts.require("DappTokenSale.sol");

let tokeSaleInstance;
beforeEach(async () => {
  tokeSaleInstance = await DappTokenSale.deployed();
});

contract("DappTokenSale", function (accounts) {
  it("initializes the contract with the correct values", async function () {
    const address = await tokeSaleInstance.address;
    assert.notEqual(address, 0x0, "doesn't have a contract address");
  });
});

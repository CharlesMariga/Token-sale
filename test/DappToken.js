const DappToken = artifacts.require("DappToken.sol");

contract("DappToken", function (accounts) {
  it("initializes the contract with the correct values", async function () {
    const tokenInstance = await DappToken.deployed();
    const name = await tokenInstance.name();
    assert.equal(name, "Dapp Token", "has the correct name");
    const symbol = await tokenInstance.symbol();
    assert.equal(symbol, "DAPP", "has the correct symbol");
    const standard = await tokenInstance.standard();
    assert.equal(standard, "Dapp Token v1.0", "has the correct standard");
  });

  it("allocatoes initial supply upon deployment", async function () {
    // Check that the total supply vairable has been set to the total initial
    //  coin offering
    const tokenInstance = await DappToken.deployed();
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      1000000,
      "sets the total supply to 1,000,000"
    );

    // Check that the admin balance is set to the total initial coin offering
    const adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(
      adminBalance.toNumber(),
      1000000,
      "it allocates the initial supply to the admin account"
    );
  });
});

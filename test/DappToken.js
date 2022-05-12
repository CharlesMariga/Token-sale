const DappToken = artifacts.require("DappToken.sol");

let tokenInstance;
const initialSupply = 1000000;
const transferAmount = 250000;
beforeEach(async () => {
  tokenInstance = await DappToken.deployed();
});

contract("DappToken", function (accounts) {
  it("initializes the contract with the correct values", async function () {
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
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      initialSupply,
      `sets the total supply to ${initialSupply}`
    );

    // Check that the admin balance is set to the total initial coin offering
    const adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(
      adminBalance.toNumber(),
      initialSupply,
      "it allocates the initial supply to the admin account"
    );
  });

  it("tranfers token ownership", async function () {
    try {
      await tokenInstance.transfer.call(accounts[1], 99999999);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "error message must contain revert"
      );
    }

    const receipt = await tokenInstance.transfer(accounts[1], transferAmount, {
      from: accounts[0],
    });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Transfer",
      "should be the 'Transfer' event"
    );
    assert.equal(
      receipt.logs[0].args._from,
      accounts[0],
      "logs the account the tokens are transferred from"
    );
    assert.equal(
      receipt.logs[0].args._to,
      accounts[1],
      "logs the account the tokens are transferred to"
    );
    assert.equal(
      receipt.logs[0].args._value,
      transferAmount,
      "logs the transfer amount"
    );
    const balanceAcc1 = await tokenInstance.balanceOf(accounts[1]);
    assert.equal(
      balanceAcc1.toNumber(),
      transferAmount,
      "adds the amount to the receiving account"
    );
    const balanceAcc0 = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(
      balanceAcc0.toNumber(),
      initialSupply - transferAmount,
      "deducts the amount from the sending account"
    );
    const success = await tokenInstance.transfer.call(
      accounts[1],
      transferAmount,
      {
        from: accounts[0],
      }
    );
    assert.equal(success, true, "it returns true");
  });
});

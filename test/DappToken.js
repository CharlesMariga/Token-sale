const DappToken = artifacts.require("DappToken.sol");

let tokenInstance;
const initialSupply = 1000000;
const transferAmount = 250000;
const setAllowance = 100;
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

  it("allocates initial supply upon deployment", async function () {
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
      assert(false);
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

  it("approves tokens for delegated transfer", async function () {
    const success = await tokenInstance.approve.call(accounts[1], 100, {
      from: accounts[0],
    });
    assert.equal(success, true, "it returns true");
    const receipt = await tokenInstance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Approval",
      "should be the 'Transfer' event"
    );
    assert.equal(
      receipt.logs[0].args._owner,
      accounts[0],
      "logs the account the tokens are authorized by"
    );
    assert.equal(
      receipt.logs[0].args._spender,
      accounts[1],
      "logs the account the tokens are authorized to"
    );
    assert.equal(
      receipt.logs[0].args._value,
      setAllowance,
      "logs the transfer amount"
    );
    const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
    assert.equal(
      allowance.toNumber(),
      setAllowance,
      "stores the allowance for delegated transfer"
    );
  });

  it("handles delegated token transfer", async function () {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];
    let receipt = await tokenInstance.transfer(fromAccount, setAllowance, {
      from: accounts[0],
    });
    await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });

    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 99999, {
        from: spendingAccount,
      });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "cannot transfer value larger than balance"
      );
    }

    try {
      await tokenInstance.transferFrom(fromAccount, toAccount, 20, {
        from: spendingAccount,
      });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "cannot transfer value larger than approved amount"
      );
    }

    const success = await tokenInstance.transferFrom.call(
      fromAccount,
      toAccount,
      10,
      {
        from: spendingAccount,
      }
    );
    assert.equal(success, true);
    receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, {
      from: spendingAccount,
    });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Transfer",
      "should be the 'Transfer' event"
    );
    assert.equal(
      receipt.logs[0].args._from,
      accounts[2],
      "logs the account the tokens were transferred from"
    );
    assert.equal(
      receipt.logs[0].args._to,
      accounts[3],
      "logs the account the tokens were transferred to"
    );
    assert.equal(receipt.logs[0].args._value, 10, "logs the transfer amount");

    const balanceOfFromAcc = await tokenInstance.balanceOf(fromAccount);
    assert.equal(
      balanceOfFromAcc.toNumber(),
      setAllowance - 10,
      "deducts the amount from the sending account"
    );
    const balanceOfToAccount = await tokenInstance.balanceOf(toAccount);
    assert.equal(
      balanceOfToAccount.toNumber(),
      10,
      "adds the amount to the receiving account"
    );
    const allowance = await tokenInstance.allowance(
      fromAccount,
      spendingAccount
    );
    assert.equal(
      allowance.toNumber(),
      0,
      "deducts the amount from the allowance"
    );
  });
});

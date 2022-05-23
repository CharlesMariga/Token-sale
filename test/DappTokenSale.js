const DappTokenSale = artifacts.require("DappTokenSale.sol");
const DappToken = artifacts.require("DappToken.sol");

let tokenSaleInstance;
let tokenInstance;
let buyer;
let admin;
let tokensAvailable = 750000;
let tokenPrice = 1000000000000000;
beforeEach(async () => {
  tokenSaleInstance = await DappTokenSale.deployed();
  tokenInstance = await DappToken.deployed();
});

contract("DappTokenSale", function (accounts) {
  admin = accounts[0];
  buyer = accounts[1];

  it("initializes the contract with the correct values", async function () {
    let address = await tokenSaleInstance.address;
    assert.notEqual(address, 0x0, "doesn't have a contract address");
    address = await tokenSaleInstance.tokenContract();
    assert.notEqual(address, 0x0, "has token contract address");
    const price = await tokenSaleInstance.tokenPrice();
    assert.equal(price, tokenPrice, "token price is not set correctly");
  });

  it("facilitates token buying", async function () {
    await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {
      from: admin,
    });
    const numberOfTokens = 10;
    const value = numberOfTokens * tokenPrice;
    const receipt = await tokenSaleInstance.buyTokens(numberOfTokens, {
      from: buyer,
      value,
    });
    assert.equal(receipt.logs.length, 1, "triggers an event");
    assert.equal(receipt.logs[0].event, "Sell", "should be the 'Sell' event");
    assert.equal(
      receipt.logs[0].args._buyer,
      buyer,
      "logs the account that purchased the tokens"
    );
    assert.equal(
      receipt.logs[0].args._amount,
      numberOfTokens,
      "logs the number of tokens purchased"
    );
    const amount = await tokenSaleInstance.tokensSold();
    assert.equal(
      amount.toNumber(),
      numberOfTokens,
      "increments the number of tokens sold"
    );

    try {
      await tokenSaleInstance.buyTokens(numberOfTokens, {
        from: buyer,
        value: 1,
      });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "msg.value must equal number of tokens in wei"
      );
    }

    try {
      await tokenSaleInstance.buyTokens(775000, {
        from: buyer,
        value: 775000 * tokenPrice,
      });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("enough") >= 0,
        "cannot purchase more tokens than available"
      );
    }

    const balance = await tokenInstance.balanceOf(tokenSaleInstance.address);
    assert.equal(
      balance.toNumber(),
      tokensAvailable - numberOfTokens,
      "tokens weren't deducted successfully"
    );
    const buyerBalance = await tokenInstance.balanceOf(buyer);
    assert.equal(
      buyerBalance.toNumber(),
      numberOfTokens,
      "tokens weren't transferred successfully"
    );
  });

  it("ends token sale", async function () {
    try {
      await tokenSaleInstance.endSale({ from: buyer });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "must be admin to end the sale"
      );
    }

    await tokenSaleInstance.endSale({ from: admin });
    const balance = await tokenInstance.balanceOf(admin);
    assert.equal(
      balance.toNumber(),
      999990,
      "returns all unsold dapp tokens to admin"
    );
    try {
      await tokenSaleInstance.tokenPrice();
    } catch (err) {
      assert(true);
    }
  });
});

const DappTokenSale = artifacts.require("DappTokenSale.sol");
const DappToken = artifacts.require("DappToken.sol");

let tokeSaleInstance;
let tokenInstance;
let buyer;
let admin;
let tokensAvailable = 750000;
let tokenPrice = 1000000000000000;
beforeEach(async () => {
  tokeSaleInstance = await DappTokenSale.deployed();
  tokenInstance = await DappToken.deployed();
});

contract("DappTokenSale", function (accounts) {
  admin = accounts[0];
  buyer = accounts[1];

  it("initializes the contract with the correct values", async function () {
    let address = await tokeSaleInstance.address;
    assert.notEqual(address, 0x0, "doesn't have a contract address");
    address = await tokeSaleInstance.tokenContract();
    assert.notEqual(address, 0x0, "has token contract address");
    const price = await tokeSaleInstance.tokenPrice();
    assert.equal(price, tokenPrice, "token price is not set correctly");
  });

  it("facilitates token buying", async function () {
    await tokenInstance.transfer(tokeSaleInstance.address, tokensAvailable, {
      from: admin,
    });
    const numberOfTokens = 10;
    const value = numberOfTokens * tokenPrice;
    const receipt = await tokeSaleInstance.buyTokens(numberOfTokens, {
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
    const amount = await tokeSaleInstance.tokensSold();
    assert.equal(
      amount.toNumber(),
      numberOfTokens,
      "increments the number of tokens sold"
    );

    try {
      await tokeSaleInstance.buyTokens(numberOfTokens, {
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
      await tokeSaleInstance.buyTokens(800000, {
        from: buyer,
        value: 800000 * tokenPrice,
      });
      assert(false);
    } catch (err) {
      assert(
        err.message.indexOf("revert") >= 0,
        "cannot purchase more tokens than available"
      );
    }

    const balance = await tokenInstance.balanceOf(tokeSaleInstance.address);
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
});
